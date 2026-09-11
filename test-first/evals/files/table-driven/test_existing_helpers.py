"""Existing helper tests — house style for this package."""
import pytest

from helpers import truncate_words


@pytest.mark.parametrize(
    "text,limit,expected",
    [
        ("one two three", 2, "one two"),
        ("one two three", 5, "one two three"),
        ("", 3, ""),
    ],
)
def test_a_summary_is_cut_to_the_requested_number_of_words(text, limit, expected):
    assert truncate_words(text, limit) == expected
