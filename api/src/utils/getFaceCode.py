import face_recognition
import sys

if sys.argv[1] == None:
    print ("No image path provided")
    sys.exit(1)

def get_code(image_path):
  image = face_recognition.load_image_file(image_path)

  return face_recognition.face_encodings(image)[0]

image = sys.argv[1]

print (get_code(image))    