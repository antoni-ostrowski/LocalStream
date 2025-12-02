import { makeMusicUrl } from '@/lib/utils'
import { useStore } from '@tanstack/react-store'
import { useRef, type RefObject } from 'react'
import { playerStore } from '../../store'
import PlaybackControls from './playback-controls'
import PreloadTrack from './preload-track'
import ProgressBar from './progress-bar'
import TrackMetadata from './track-metadata'
import usePlayerHandlers from './use-player-handlers'
import VolumeControls from './volume-controls'

export type AudioRefType = RefObject<HTMLVideoElement | null>
export type ProgressBarRefType = RefObject<HTMLInputElement | null>

export default function PlayerAudioHandler() {
  const audioRef = useRef<HTMLVideoElement>(null)
  const progressBarRef = useRef<HTMLInputElement>(null)
  const { queue, currentTrack, isPlaying } = useStore(playerStore)

  const {
    currentTime,
    handleEnded,
    handleSkipForward,
    handlePause,
    handlePlay,
    handleTimeUpdate,
    onLoadedMetadata,
    setCurrentTime,
  } = usePlayerHandlers(audioRef, progressBarRef)

  return (
    <>
      {currentTrack && (
        <>
          <PreloadTrack nextTrackToPreload={queue[0] ?? null} />
          <PreloadTrack nextTrackToPreload={queue[1] ?? null} />
          <PreloadTrack nextTrackToPreload={queue[3] ?? null} />
          <audio
            ref={audioRef}
            preload="auto"
            src={makeMusicUrl(currentTrack.path)}
            autoPlay
            onEnded={handleEnded}
            onLoadedMetadata={onLoadedMetadata}
            onTimeUpdate={handleTimeUpdate}
          />

          <TrackMetadata {...{ currentTrack }} />
          <div className="flex w-full flex-col items-center justify-center gap-5">
            <ProgressBar
              {...{
                currentTrack,
                audioRef,
                handlePause,
                handlePlay,
                progressBarRef,
                currentTime,
                setCurrentTime,
              }}
            />

            <VolumeControls audioRef={audioRef} />

            <PlaybackControls
              {...{ isPlaying, handlePause, handlePlay, handleSkipForward }}
            />
          </div>
        </>
      )}
    </>
  )
}
