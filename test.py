import pytest

from main import cypher, cypher_word, decypher, decypher_word
from seed import get_seed_phrase

def test_cypher_one_digit():
    assert cypher("A", 1) == "B"

def test_cypher_multiple_digits():
    assert cypher("A", 5) == "F"

def test_cypher_wraps_around():
    assert cypher("Z", 1) == "A"

def test_cypher_word_simple():
    assert cypher_word("test", [1,2,3,4]) == "UGVX"

def test_cypher_shift_array_wraps_simple():
    assert cypher_word("testlongword", [1,2,3,4]) == "UGVXMQQKXQUH"

def test_cypher_word_complex():
    assert cypher_word("test", [4,10,24,1]) == "XOQU"


def test_decypher_one_digit():
    assert decypher("B", 1) == "A"

def test_decypher_multiple_digits():
    assert decypher("F", 5) == "A"

def test_decypher_wraps_around():
    assert decypher("A", 1) == "Z"

def test_decypher_word_simple():
    assert decypher_word("UGVX", [1,2,3,4]) == "TEST"

def test_cypher_shift_array_wraps_simple():
    assert decypher_word("UGVXMQQKXQUH", [1,2,3,4]) == "TESTLONGWORD"

def test_cypher_word_complex():
    assert decypher_word("XOQU", [4,10,24,1]) == "TEST"

def test_get_seed_words():
    words = get_seed_phrase()
    assert len(words.split(" ")) == 24