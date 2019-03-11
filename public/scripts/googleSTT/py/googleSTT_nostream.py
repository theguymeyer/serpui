from __future__ import division

import io
import re
import sys
import os

from google.cloud import speech
from google.cloud.speech import enums
from google.cloud.speech import types
import pyaudio
from six.moves import queue

os.environ["GOOGLE_APPLICATION_CREDENTIALS"]="/home/guy/Documents/masters/thesis/Design/app/interface/localTesting/googleSTT/ottoCustomSE-5830686e0ce6.json"

# Globals
sampling_rate = 16000

# Audio recording parameters
RATE = 16000
CHUNK = int(RATE / 10)  # 100ms

# Instantiates a client
client = speech.SpeechClient()

# command line command to convert mp3 to wav (worked)
# ffmpeg -i mp3Test1.mp3 -acodec pcm_s16le -ac 1 -ar 16000 out.wav


# The name of the audio file to transcribe
file_name = os.path.join(
    os.path.dirname('__file__'),
    '/home/guy/Audio/',
    'out.wav')

# Loads the audio into memory
with io.open(file_name, 'rb') as audio_file:
    content = audio_file.read()
    audio = types.RecognitionAudio(content=content)

config = types.RecognitionConfig(
    encoding=enums.RecognitionConfig.AudioEncoding.LINEAR16,
    sample_rate_hertz=sampling_rate,
    language_code='en-US')

# Detects speech in the audio file
response = client.recognize(config, audio)

#print(audio, file=sys.stderr)
print(response.results)

for result in response.results:
    print('Transcript: {}'.format(result.alternatives[0].transcript))
#    print ('    line 1e to stderr  ', file=sys.stderr)


# --------------------------------

def transcribe_file(speech_file):
    """Transcribe the given audio file."""
    from google.cloud import speech
    from google.cloud.speech import enums
    from google.cloud.speech import types
    client = speech.SpeechClient()

    with io.open(speech_file, 'rb') as audio_file:
        content = audio_file.read()

    m_audio = types.RecognitionAudio(content=content)
    m_config = types.RecognitionConfig(
        encoding=enums.RecognitionConfig.AudioEncoding.LINEAR16,
        sample_rate_hertz=sampling_rate,
        language_code='en-US')

    response = client.recognize(m_config, m_audio)
    # Each result is for a consecutive portion of the audio. Iterate through
    # them to get the transcripts for the entire audio file.

    print(response.results)
    for result in response.results:
        # The first alternative is the most likely one for this portion.
        print(u'Transcript: {}'.format(result.alternatives[0].transcript))



transcribe_file(file_name)
