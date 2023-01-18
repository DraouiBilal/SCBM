import os
import cv2
import sys
import numpy as np
from keras.models import load_model

if sys.argv[1] is None:
    print('Please provide a path to the image file.')
    sys.exit()

def find_phone(path):
    """ This function is used to predict coordinates using the trained model. """
    # Getting file name and path from the input.
    file_name = list(path.split('/'))[-1]
    path_list = list(path.split('/'))[:-1]
    new_path = ''
    for i, element in enumerate(path_list):
        if i < len(path_list) - 1:
            new_path = new_path + element + '\\'
        else:
            new_path = new_path + element
    print(file_name, path_list,new_path)
    # Setting the path to folder containing weights.
    os.chdir(new_path)

    # Reading the image file.
    x_variable = []
    img = cv2.imread(file_name)
    resized_image = cv2.resize(img, (64, 64))
    x_variable.append(resized_image.tolist())
    x_variable = np.asarray(x_variable)
    x_variable = np.interp(x_variable, (x_variable.min(), x_variable.max()), (0, 1))

    # Loading the Deep Learning Model.
    model = load_model('train_phone_finder_weights.h5')
    result = model.predict(x_variable)
    if result[0][0] and result[0][1]: 
        return True
    else:
        return False
    
phoneFile = sys.argv[1]

print(find_phone(phoneFile))