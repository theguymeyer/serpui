#!/bin/sh

sudo ffmpeg -y -i $1 -acodec pcm_s16le -f s16le -ac 1 -ar 16000 $2