import { Room, createLocalAudioTrack } from 'livekit-client';

export interface LiveKitCredentials {
  url: string;
  token: string;
}

export async function connectToLiveKitRoom({ url, token }: LiveKitCredentials): Promise<Room> {
  // Connect to the LiveKit room using v2.13.8 API
  const room = new Room({
    // Connection options for v2.13.8
    adaptiveStream: true,
    dynacast: true,
  });
  
  await room.connect(url, token);
  return room;
}

export async function publishMicrophoneAudio(room: Room) {
  // Create a local audio track from the user's microphone using v2.13.8 API
  const audioTrack = await createLocalAudioTrack({
    // Audio track options for v2.13.8
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
  });
  
  // Publish the audio track to the room
  await room.localParticipant.publishTrack(audioTrack);
  return audioTrack;
} 