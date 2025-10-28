from passlib.hash import sha512_crypt
import getpass

password = getpass.getpass("Enter password: ")
hashed = sha512_crypt.hash(password)
print(hashed)