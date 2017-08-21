import React, {Component} from 'react';
import axios from 'axios';
import request from 'request';

import './App.css';
import { FormGroup, FormControl, InputGroup, Glyphicon} from 'react-bootstrap';
import Profile from './Profile';
import Gallery from './Gallery';

const SPOTIFY_BASE_URL = 'https://api.spotify.com/v1/search';
const SPOTIFY_ALBUM_URL = 'https://api.spotify.com/v1/artists';
const clientId = "10bb7383a17b407fb92aeaf15af4c287";
const clientSecret = "7fa66820a66e446fb198e5888853e03c";
const accessToken = 'BQAhDUs6jGT_Ook0wz0kKlLiWHbq2E6iOlJhhPwpMO5dCh3aLZMG5y3NUD9qxDL_MhZ_aHIjk3G2SRViKFCx5HgBo2h5mBlRUgJSrL7XcOqMN18xdEV3oNgLeYTUMWnpCQ7a0uEIaE9qm-y2Ohb8BRlaJe7dIdH1&refresh_token=AQCJe-HfrZ_YbbGji44inLRZwjVw93bhkOzFeepQhdLSbErLmWxK20LQK8qhM6dtcTvhZZ3PlAGGcO60wiQQEsUAROfJQ8ZBweY24hIRxK1uB0OBlICFkHnOdSBaS4F7810';

export default class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            query : '',
            artist: null,
            tracks: [],
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.search = this.search.bind(this);
        this.callSpotify = this.callSpotify.bind(this);
        //this.search()
    }

    search(){
        this.fetchArtistData();
    }

    fetchArtistData(){
        const FETCH_URL = `${SPOTIFY_BASE_URL}?q=${this.state.query}&type=artist&limit=1`;
       
        //const redirectURI = 'http://localhost:3000/'
        //const encodedData = new Buffer(clientId + ':' + clientSecret).toString('base64');
        //const authHeaderString = 'Authorization: Bearer ' + encodedData;  

        const myOptions = {
            method: 'GET',
            headers: {
                'Authorization' : 'Bearer ' + accessToken
            },
            mode: 'cors',
            cache: 'default'
        };
        const json_data = this.callSpotify( FETCH_URL, myOptions, ( 
                    data => {
                        this.setState({artist: data.artists.items[0]})
                        this.fetchAlbumDetails()
                    }
                ));
    }

    fetchAlbumDetails(){
        //console.log(this.state.artist);
        const FETCH_URL = `${SPOTIFY_ALBUM_URL}/${this.state.artist.id}/top-tracks?country=US&`;
        //console.log('access token ', accessToken)
        const myOptions = {
            method: 'GET',
            headers: {
                'Authorization' : 'Bearer ' + accessToken
            },
            mode: 'cors',
            cache: 'default'
        };
        const album_details = this.callSpotify(FETCH_URL, myOptions, (
                data => this.setState({ tracks : data.tracks })
        ));

    }

    callSpotify( url , options, callback){
        return fetch(url, options)
            .then( response => response.json())
            .then( json => callback(json) )
    }

    handleChange(event){
        this.setState({ query: event.target.value});
    }

    handleKeyPress(event){
        if (event.key === 'Enter'){
            this.search()
        }
    }

    render(){
        return (
            <div className="container">
                {/*<Header />*/}

                <div className="app">
                    <div className="app-title">Music Master</div>
                    
                    <FormGroup>
                        <InputGroup>
                            <FormControl 
                                type="text"
                                placeholder="Search for an artist"
                                value = {this.state.query}
                                onChange = {this.handleChange}
                                onKeyPress = {this.handleKeyPress}
                            />
                            <InputGroup.Addon onClick={this.search}>
                                <Glyphicon glyph="search"></Glyphicon>
                            </InputGroup.Addon>
                        </InputGroup>
                    </FormGroup>

                    { 
                        this.state.artist !== null 
                        ? 
                            <div>
                                <Profile artist={this.state.artist} />

                                <Gallery tracks={this.state.tracks} />
                            </div>
                        : <div></div>
                    }
                </div>
            </div>
            
        );
    }
}