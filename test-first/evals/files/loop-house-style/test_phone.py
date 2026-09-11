"""Existing validator tests."""
from phone import is_valid_phone

CASES = [
    ("07700900123", True),
    ("0770090012", False),
    ("07700-900123", False),
    ("", False),
]


def test_phone_numbers_are_validated():
    for value, expected in CASES:
        assert is_valid_phone(value) == expected
