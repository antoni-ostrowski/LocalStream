package playback

import (
	"fmt"
)

type Queue struct {
	streamers []*Playable
}

func (q *Queue) Add(playables ...*Playable) {
	fmt.Printf("adding toqueue %v\n", playables)

	q.streamers = append(q.streamers, playables...)
}

func (q *Queue) Stream(samples [][2]float64) (n int, ok bool) {
	fmt.Print("queue stream func start \n")
	// We use the filled variable to track how many samples we've
	// successfully filled already. We loop until all samples are filled.
	filled := 0
	for filled < len(samples) {
		// There are no streamers in the queue, so we stream silence.
		if len(q.streamers) == 0 {
			for i := range samples[filled:] {
				samples[i][0] = 0
				samples[i][1] = 0
			}
			fmt.Print("no strearms to stream \n")
			break
		}

		fmt.Print("streaming from queue \n")
		// We stream from the first streamer in the queue.
		n, ok := q.streamers[0].Streamer.Stream(samples[filled:])
		// If it's drained, we pop it from the queue, thus continuing with
		// the next streamer.
		if !ok {
			q.streamers = q.streamers[1:]
		}
		// We update the number of filled samples.
		filled += n
	}
	return len(samples), true
}

func (q *Queue) Err() error {
	return nil
}

func (q *Queue) GetCurrentPlayable() *Playable {
	if len(q.streamers) == 0 {
		return &Playable{}
	}
	return q.streamers[0]
}
