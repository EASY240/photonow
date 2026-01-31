from nudenet import NudeDetector

detector = NudeDetector()

def predictor(image_paths, batch_size=1):
    return detector.detect_batch(image_paths, batch_size=batch_size)



