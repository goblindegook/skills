import time
import random
import pytest
from app.orders import OrderService
from app.db import get_db_session


@pytest.fixture(scope="function")
def db():
    session = get_db_session("test")
    yield session
    session.rollback()
    session.close()


@pytest.fixture
def order_service(db):
    return OrderService(db)


class TestOrderCreation:
    def test_creates_order_with_valid_items(self, order_service):
        order = order_service.create(
            user_id=1,
            items=[{"sku": "WIDGET-A", "qty": 2, "price": 9.99}]
        )
        assert order.id is not None
        assert order.status == "pending"
        assert len(order.items) == 1

    def test_rejects_empty_items(self, order_service):
        with pytest.raises(ValueError, match="at least one item"):
            order_service.create(user_id=1, items=[])

    def test_rejects_negative_quantity(self, order_service):
        with pytest.raises(ValueError, match="quantity must be positive"):
            order_service.create(
                user_id=1,
                items=[{"sku": "WIDGET-A", "qty": -1, "price": 9.99}]
            )

    def test_total_is_calculated_correctly(self, order_service):
        order = order_service.create(
            user_id=1,
            items=[
                {"sku": "WIDGET-A", "qty": 2, "price": 9.99},
                {"sku": "WIDGET-B", "qty": 1, "price": 4.99}
            ]
        )
        assert order.total == pytest.approx(24.97)


class TestOrderFulfillment:
    def test_ships_pending_order(self, order_service):
        order = order_service.create(
            user_id=1,
            items=[{"sku": "WIDGET-A", "qty": 1, "price": 9.99}]
        )
        shipped = order_service.ship(order.id, tracking="1Z999AA10123456784")
        assert shipped.status == "shipped"
        assert shipped.tracking_number == "1Z999AA10123456784"

    def test_cannot_ship_already_shipped_order(self, order_service):
        order = order_service.create(
            user_id=1,
            items=[{"sku": "WIDGET-A", "qty": 1, "price": 9.99}]
        )
        order_service.ship(order.id, tracking="1Z999AA10123456784")
        with pytest.raises(ValueError, match="already shipped"):
            order_service.ship(order.id, tracking="NEW_TRACKING")

    def test_processing_delay(self, order_service):
        # wait for async processing to complete
        order = order_service.create(
            user_id=1,
            items=[{"sku": "WIDGET-A", "qty": 1, "price": 9.99}]
        )
        time.sleep(2)  # wait for background processor
        refreshed = order_service.get(order.id)
        assert refreshed.inventory_reserved is True

    def test_uses_timestamp_for_ordering(self, order_service):
        # flaky: relies on wall clock ordering
        t = time.time()
        o1 = order_service.create(user_id=1, items=[{"sku": "A", "qty": 1, "price": 1}])
        o2 = order_service.create(user_id=1, items=[{"sku": "B", "qty": 1, "price": 1}])
        orders = order_service.list_recent(user_id=1)
        assert orders[0].id == o2.id
