title: "哪天可能就靠脸吃饭了"
date: 2018-01-10 20:00:00 +0800
author: me
tags:
    - 技术杂记
    - 人脸识别
    - 试验田
preview: face_recognition是Python下的一个开源人脸识别库，简单试用一下。

---

之前把环境都装好了，写个小玩意跑跑。

```python
import cv2

import os

import face_recognition

from PyQt5.QtCore import QThread, pyqtSignal

from PyQt5.QtGui import QPixmap, QImage

import ctypes

import time


class vidCapture(QThread):

    def __init__(self, ui):
        super().__init__()

        self.ui = ui
        self.working = True

    def __del__(self):
        self.wait()

    def run(self):

        facelist = []

        for f in os.listdir("."):
            if os.path.splitext(f)[1] == ".jpg":
                # Load a sample picture and learn how to recognize it.
                target_image = face_recognition.load_image_file(f)
                target_face_encoding = face_recognition.face_encodings(target_image)[0]
                facelist.append((target_face_encoding, os.path.splitext(f)[0]))

        # Initialize some variables
        face_locations = []
        face_encodings = []
        face_names = []
        process_this_frame = True

        stream = cv2.VideoCapture('98.sdp')

        libenc = ctypes.cdll.LoadLibrary("rtp_ff.dll")

        libenc.fnrtp_open(b"rtp://192.165.53.138:5000", 720, 576, 25, 2000000);

        #
        # self.cam = cv2.VideoCapture(0)
        # self.cam.set(3, 800)
        # self.cam.set(4, 600)


        while self.working and stream.isOpened():

            ret, frame = stream.read()

            # ret, img = self.cam.read()

            if not ret:
                continue

            #
            # frame = cv2.flip(img, 1)

            resize_factor = 0.25

            # Resize frame of video to 1/4 size for faster face recognition processing
            small_frame = cv2.resize(frame, (0, 0), fx=resize_factor, fy=resize_factor)

            # Only process every other frame of video to save time
            if process_this_frame:
                # Find all the faces and face encodings in the current frame of video
                face_locations = face_recognition.face_locations(small_frame)
                face_encodings = face_recognition.face_encodings(small_frame, face_locations)

                face_names = []
                for face_encoding in face_encodings:
                    name = "Unknown"
                    old_distance = 1
                    for target_face in facelist:
                        # See if the face is a match for the known face(s)
                        distance = face_recognition.face_distance([target_face[0]], face_encoding)

                        if (distance < 0.5) and (old_distance > distance):
                            name = target_face[1]
                            old_distance = distance

                    face_names.append(name)

            process_this_frame = not process_this_frame

            # Display the results
            for (top, right, bottom, left), name in zip(face_locations, face_names):
                # Scale back up face locations since the frame we detected in was scaled to 1/4 size
                top = int(top / resize_factor)
                right = int(right / resize_factor)
                bottom = int(bottom / resize_factor)
                left = int(left / resize_factor)

                # Draw a box around the face
                cv2.rectangle(frame, (left, top), (right, bottom), (0, 0, 255), 2)

                # Draw a label with a name below the face
                cv2.rectangle(frame, (left, bottom - 35), (right, bottom), (0, 0, 255), cv2.FILLED)
                font = cv2.FONT_HERSHEY_DUPLEX
                cv2.putText(frame, name, (left + 6, bottom - 6), font, 1.0, (255, 255, 255), 1)

            frame1 = cv2.cvtColor(frame, cv2.COLOR_BGR2YUV_I420)

            ret = libenc.fnrtp_encode(ctypes.c_char_p(frame1.data.tobytes()))

            frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

            frame1 = QImage(frame, frame.shape[1], frame.shape[0], QImage.Format_RGB888)
            pixmap = QPixmap.fromImage(frame1)

#            self.imgreceived.emit(facedata, pixmap)
            self.ui.video.setPixmap(pixmap)


        # self.cam.release()

        stream.release()


    def exit(self):

        self.working = False



def show_webcam(mirror=False):

    libenc = ctypes.cdll.LoadLibrary("rtp_ff.dll")

    libenc.fnrtp_open(b"rtp://192.165.53.31:12345", 640, 480, 25, 2000000);

    # Get a reference to webcam #0 (the default one)
    video_capture = cv2.VideoCapture(0)
#    rtpstream = cv2.VideoWriter('rtp://192.165.53.31:12346', cv2.VideoWriter_fourcc('H', '2', '6', '4'), 25.0, (640, 480))

    facelist = []

    for f in os.listdir("."):
        if os.path.splitext(f)[1] == ".jpg":
            # Load a sample picture and learn how to recognize it.
            target_image = face_recognition.load_image_file(f)
            target_face_encoding = face_recognition.face_encodings(target_image)[0]
            facelist.append((target_face_encoding, os.path.splitext(f)[0]))

    # Initialize some variables
    face_locations = []
    face_encodings = []
    face_names = []
    process_this_frame = True

    while True:
        # Grab a single frame of video
        ret, frame = video_capture.read()

        if mirror:
            frame = cv2.flip(frame, 1)

        # Resize frame of video to 1/4 size for faster face recognition processing
        small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)

        # Only process every other frame of video to save time
        if process_this_frame:
            # Find all the faces and face encodings in the current frame of video
            face_locations = face_recognition.face_locations(small_frame)
            face_encodings = face_recognition.face_encodings(small_frame, face_locations)

            face_names = []
            for face_encoding in face_encodings:
                name = "Unknown"
                for target_face in facelist:
                    # See if the face is a match for the known face(s)
                    match = face_recognition.compare_faces([target_face[0]], face_encoding)

                    if match[0]:
                        name = target_face[1]
                        break

                face_names.append(name)

        process_this_frame = not process_this_frame


        # Display the results
        for (top, right, bottom, left), name in zip(face_locations, face_names):
            # Scale back up face locations since the frame we detected in was scaled to 1/4 size
            top *= 4
            right *= 4
            bottom *= 4
            left *= 4

            # Draw a box around the face
            cv2.rectangle(frame, (left, top), (right, bottom), (0, 0, 255), 2)

            # Draw a label with a name below the face
            cv2.rectangle(frame, (left, bottom - 35), (right, bottom), (0, 0, 255), cv2.FILLED)
            font = cv2.FONT_HERSHEY_DUPLEX
            cv2.putText(frame, name, (left + 6, bottom - 6), font, 1.0, (255, 255, 255), 1)

        # Display the resulting image
        cv2.imshow('Video', frame)

        frame1 = cv2.cvtColor(frame, cv2.COLOR_BGR2YUV_I420)

        ret = libenc.fnrtp_encode(ctypes.c_char_p(frame1.data.tobytes()))

        # Hit 'q' on the keyboard to quit!
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    # Release handle to the webcam
    video_capture.release()
    cv2.destroyAllWindows()




if __name__ == '__main__':

    show_webcam(mirror=True)
```

测试例子是从摄像头得到图像，识别后显示结果，后来又加上编码为H.264的部分。之后用QT写了个框框，视频源也改为接收RTP。混杂了不少东西。顺便也整理一下python调用C++ dll的路线。

dll就是拿之前那个FF编码的代码改改。