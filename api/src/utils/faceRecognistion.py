import face_recognition
import sys

if sys.argv[1] == None:
    print ("No image path provided")
    sys.exit(1)

if sys.argv[2] == None:
    print ("Only one image path was provided")
    sys.exit(1)

image1 = sys.argv[1]
image2 = sys.argv[2]


def recognize(image_path, registered_face_path):
  image = face_recognition.load_image_file(image_path)
  registered_face = face_recognition.load_image_file(registered_face_path)

  registered_face_code = face_recognition.face_encodings(registered_face)[0]

  face_code = face_recognition.face_encodings(image)[0]
  return face_recognition.compare_faces([face_code], registered_face_code)

res = recognize(image1, image2) 

print(res[0])