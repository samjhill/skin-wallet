from mnemonic import Mnemonic
import bip32utils

def get_seed_phrase():
    mnemo = Mnemonic("english")
    words = mnemo.generate(strength=256)

    return words

def get_wallet_info(seed_phrase):
    mnemo = Mnemonic("english")
    mnemo.check(seed_phrase)
    seed = mnemo.to_seed(seed_phrase)
    root_key = bip32utils.BIP32Key.fromEntropy(seed)
    root_address = root_key.Address()
    root_public_hex = root_key.PublicKey().hex()
    root_private_wif = root_key.WalletImportFormat()

    return root_address, root_public_hex, root_private_wif