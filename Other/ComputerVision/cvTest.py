import cv2 

img_grayscale = cv2.imread("Other\ComputerVision\LND01.jpg", 0)

cv2.imshow("grayscale image", img_grayscale)

cv2.waitKey(0)

cv2.destroyAllWindows()

cv2.imwrite("grayscaleImg", img_grayscale)