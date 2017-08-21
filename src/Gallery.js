import React, {Component} from 'react';
import './App.css';

export default class Gallery extends Component{
    constructor(props){
        super(props);
        this.state = {
            playingUrl : '',
            audio: null,
            isPlaying: false
        }
    }

    playAudio(preview_url){
        let audio = new Audio(preview_url);
        if (!this.state.isPlaying){
            audio.play();
            this.setState({
                audio,
                playingUrl: preview_url,
                isPlaying: true
            })
        }else{
            if( this.state.playingUrl === preview_url ){
                this.state.audio.pause();
                this.setState({ isPlaying: false})
            }else{
                this.state.audio.pause();
                audio.play();
                this.setState({
                    audio,
                    playingUrl: preview_url,
                    isPlaying: true
                })
            }
        }
        
    }

    render(){
        const {tracks} = this.props;
        return (
            <div>
                {tracks.map( (track, i) => {
                    const trackImg = track.album.images[0].url;
                    return(
                        <div key={i} className="track" onClick={() => this.playAudio(track.preview_url)}>
                            <img src={trackImg} alt="track" className="track-img" />
                            <div className="track-play">
                                <div className="track-play-inner">
                                    {
                                        this.state.playingUrl == track.preview_url 
                                        ? <span> | |</span>
                                        : <span>&#9654;</span>
                                    }
                                </div>    
                            </div>
                            <p className="track-text">{track.name}</p>
                        </div>
                    ); 
                })}
            </div>
        );
    }
}