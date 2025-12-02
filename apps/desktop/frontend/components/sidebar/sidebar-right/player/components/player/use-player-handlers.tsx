import { useStore } from '@tanstack/react-store'
import { useState } from 'react'
import { playerStore, updatePlayerStore } from '../../store'
import type { AudioRefType, ProgressBarRefType } from './player-audio-handler'

export default function usePlayerHandlers(
  audioRef: AudioRefType,
  progressBarRef: ProgressBarRefType
) {
  const { queue } = useStore(playerStore)
  const [currentTime, setCurrentTime] = useState(0)

  function onLoadedMetadata() {
    const seconds = audioRef.current?.duration
    if (seconds !== undefined) {
      if (progressBarRef.current) {
        progressBarRef.current.max = seconds.toString()
      }
    }
  }

  function handleTimeUpdate() {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  function handlePlay() {
    console.log('Audio playback started.')
    void audioRef.current?.play()
    updatePlayerStore('isPlaying', true)
  }

  function handlePause() {
    console.log('Audio playback paused.')
    audioRef.current?.pause()
    updatePlayerStore('isPlaying', false)
  }
  function handleSkipForward() {
    console.log('Skipping forward')
    const nextTrackFromQueue = queue[0]
    if (audioRef.current && nextTrackFromQueue?.path) {
      updatePlayerStore('currentTrack', nextTrackFromQueue)
      updatePlayerStore('queue', queue.slice(1, queue.length))
    }
  }
  function handleEnded() {
    console.log('Audio ended. Time to play the next song!')
    handleSkipForward()
  }
  return {
    onLoadedMetadata,
    handleTimeUpdate,
    handlePlay,
    handlePause,
    handleSkipForward,
    handleEnded,
    currentTime,
    setCurrentTime,
  }
}
