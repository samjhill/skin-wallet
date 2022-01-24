import qrcode

from seed import get_seed_phrase, get_wallet_info


LETTERS = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z"
]

def cypher(letter, shift_number):
    letter_position = LETTERS.index(letter.upper())
    new_position = (letter_position + shift_number) % len(LETTERS)

    return LETTERS[new_position]


def decypher(letter, shift_number):
    letter_position = LETTERS.index(letter.upper())
    new_position = (letter_position - shift_number) % len(LETTERS)
    
    return LETTERS[new_position]


def cypher_word(word, shift_numbers = []):
    word_split = list(word)

    cypher_result = ""
    for i,v in enumerate(word_split):
        cypher_result += cypher(v, shift_numbers[i % len(shift_numbers)])

    return cypher_result


def decypher_word(word, shift_numbers = []):
    word_split = list(word)

    cypher_result = ""
    for i,v in enumerate(word_split):
        cypher_result += decypher(v, shift_numbers[i % len(shift_numbers)])

    return cypher_result


def main():
    should_generate_seed_words = input("Do you want me to generate your seed words for you? y/n:")
    shift_numbers_str = input(f"Enter shift numbers separated by spaces, i.e. 1 3 5 7. Each word in your phrase will be cyphered using these numbers. YOU MUST REMEMBER THIS FOREVER, OR YOU WILL LOSE YOUR MONEY:")
    shift_numbers_list_str = shift_numbers_str.split(" ")
    shift_numbers = list(map(lambda num: int(num), shift_numbers_list_str))
    
    cyphered_results = []
    decyphered_results = []

    if should_generate_seed_words == "n":  
        for i in range(1, 24):
            word = input(f"Enter seed word {i}:")
            result = cypher_word(word, shift_numbers)
            cyphered_results.append(result)

            print(f"Result: {result}")
    else:
        print("Ok, I'll generate your seed words.")
        phrase = get_seed_phrase().split(" ")
        for i in range(0, len(phrase)):
            result = cypher_word(phrase[i], shift_numbers)
            cyphered_results.append(result)

        print("Raw:")
        print(f"{phrase} \n")

        print("Cyphered:")
        print(f"{cyphered_results} \n")

    print("Verification time!")
    for i in range(0, 24):
        word = input(f"Enter cyphered seed word {i + 1}:")
        result = decypher_word(word, shift_numbers)
        # result = decypher_word(cyphered_results[i], shift_numbers)
        # decyphered_results.append(result)

        if decypher_word(cyphered_results[i], shift_numbers) != result:
            print(f"Error in word {i + 1}: cyphered: {word}, decyphered: {result}. Should be {cyphered_results[i]}")
        else:
            print("Correct!")

    root_address, root_public_hex, root_private_wif = get_wallet_info(" ".join(decyphered_results))

    print("------ \n")
    print("Wallet info:\n")

    # print(f"Root address: {root_address}")
    print(f"Deposit coins here (public address): {root_public_hex}")

    img = qrcode.make(root_public_hex)
    img_path = f"btc-{root_public_hex}.png"
    img.save(img_path)

    print(f"Saved QR code to {img_path}")
    # print(f"Root private address: {root_private_wif}")
    



if __name__ == "__main__":
    main()