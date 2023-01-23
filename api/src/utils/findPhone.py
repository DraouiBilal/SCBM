import cv2
import sys


if sys.argv[1] is None:
    print('Please provide a path to the image file.')
    sys.exit()

# model_path = '/home/drale/Downloads/projects/web/SCBM/api/Object-Detection-with-Python-Deep-Learning-and-OpenCV'    
model_path = '/usr/src/app/Object-Detection-with-Python-Deep-Learning-and-OpenCV'    

def find_phone(path):

    image = cv2.imread(path)
    image = cv2.resize(image, (640, 480))
    h = image.shape[0]
    w = image.shape[1]

    # path to the weights and model files
    weights = model_path+"/ssd_mobilenet/frozen_inference_graph.pb"
    model = model_path+"/ssd_mobilenet/ssd_mobilenet_v3_large_coco_2020_01_14.pbtxt"
    # load the MobileNet SSD model trained  on the COCO dataset
    net = cv2.dnn.readNetFromTensorflow(weights, model)
    class_names = []
    with open(model_path+"/ssd_mobilenet/coco_names.txt", "r") as f:
        class_names = f.read().strip().split("\n")
    blob = cv2.dnn.blobFromImage(
    image, 1.0/127.5, (320, 320), [127.5, 127.5, 127.5])
    # pass the blog through our network and get the output predictions
    net.setInput(blob)
    output = net.forward() # shape: (1, 1, 100, 7)
    for detection in output[0, 0, :, :]: # output[0, 0, :, :] has a shape of: (100, 7)
    # the confidence of the model regarding the detected object
        probability = detection[2]

        # if the confidence of the model is lower than 50%,
        # we do nothing (continue looping)
        if probability < 0.5:
            continue
        class_id = int(detection[1])
        if class_id == 77:
            return True
            
    return False
        
phoneFile = sys.argv[1]

print(find_phone(phoneFile))