---
title: Data Communication Basics
type: notes
status: starter
---
# Data Communication Basics

> Starter notes drafted by an AI assistant from the public Mobile IPv4 RFCs and standard networking textbook knowledge. Not lecturer material: replace or supplement with your own course notes.

## Performance measures
- **Bandwidth:** the range of frequencies a channel passes (Hz), or loosely the maximum data rate (bit/s).
- **Throughput:** the data rate actually achieved.
- **Latency (delay):** time for data to get from source to destination: propagation + transmission + queuing + processing.
- **Jitter:** variation in delay.

## Channel capacity
Nyquist: for a noiseless channel of bandwidth B and L signal levels, the maximum bit rate is 2 B log2(L).
Shannon: for a noisy channel, capacity C = B log2(1 + SNR), where SNR is a ratio (not dB).

## Multiplexing
Sharing one link among several signals: **FDM** (frequency division), **TDM** (time division, synchronous or statistical), **WDM** (wavelength division, optical), **CDM/CDMA** (codes).

## Switching
- **Circuit switching:** a dedicated path is set up for the whole call (telephone network). Constant delay, resources reserved.
- **Packet switching:** data is split into packets that are forwarded independently (datagram) or along a virtual circuit; better link utilisation for bursty traffic, variable delay.

## Error detection and control
- **Parity bit:** detects any odd number of bit errors.
- **Checksum:** sum of data words (used by IP, TCP, UDP headers).
- **CRC:** polynomial division; the sender appends a remainder so that the frame is divisible by the generator polynomial; very good at burst-error detection (used in Ethernet).
- **Hamming code:** adds parity bits at power-of-two positions to correct single-bit errors.
- Error control by ARQ: stop-and-wait, go-back-N, selective repeat.

## Flow control
Stops a fast sender from overwhelming a slow receiver. Stop-and-wait sends one frame and waits for an acknowledgement; **sliding window** allows several unacknowledged frames to keep the link busy.

## Modulation basics
Digital data on an analog carrier: **ASK** (amplitude), **FSK** (frequency), **PSK** (phase), **QAM** (amplitude and phase together; more bits per symbol but more sensitive to noise).
