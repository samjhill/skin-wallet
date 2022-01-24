from main import decypher_word
from seed import get_wallet_info


def main():
    shift_numbers_str = input(f"Enter shift numbers separated by spaces, i.e. 1 3 5 7:")
    shift_numbers_list_str = shift_numbers_str.split(" ")
    shift_numbers = list(map(lambda num: int(num), shift_numbers_list_str))
    
    decyphered_results = []

    for i in range(0, 24):
        word = input(f"Enter cyphered seed word {i + 1}:")
        result = decypher_word(word, shift_numbers)
        decyphered_results.append(result)
        print(f"Result for word {i + 1}: {result}")

    print("Complete! Your seed words:")
    print(decyphered_results)
    



if __name__ == "__main__":
    main()