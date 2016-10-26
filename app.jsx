 "use strict";

import React from 'react';
import ImageItem from './image_item';
import {desuckify, api_key} from './util';
import * as $ from 'jquery';
import Masonry from 'react-masonry-component';

class App extends React.Component {


	constructor(props){
		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.updatePics = this.updatePics.bind(this);

		const photos = Array(6).fill({});

		this.state = {
			photos,
			query: ""
		};

	}

  // when our query string changes we invoke the handleChange event listener
	handleChange(event) {

    // this code ensures that ajax requests are only made
    // a maximum of 400ms after a user has finished typing.
    // this leads to a much faster, responsive experience.
		if(this.timeoutId)
			window.clearTimeout(this.timeoutId);

		let theQuery = event.target.value;

		this.timeoutId = window.setTimeout(() => {
			this.updatePics(theQuery);
		}, 400);

		this.setState({query: theQuery});


  }

  // this method fetches the first 5 photoIDs from the flickr search API
	updatePics(query) {

    //without this, error will occur with null query
		if (!query) {
			this.setState({query});
			return;
		}

    // hack for fetching from flickr api.
    // very poorly written, ineffective api.
		const err = (errors) => {
			let text = errors.responseText;

			if (text.includes("json")) {
				let photoResp = desuckify(text);


				let photoSlice;
				if (photoResp['photos'].photo.length === 0) {
					photoSlice = this.state.photos;
				} else {
				 photoSlice = photoResp['photos'].photo.slice(0, 6);
				}

				photoSlice = photoSlice.map(currentPhoto => {
					return {id: currentPhoto.id,
						title: currentPhoto.title};
				});

				this.setState({photos: photoSlice});
			}
		};

		$.ajax({
				url: `https://api.flickr.com/services/rest`,
				method: 'GET',
				data: {
					method: 'flickr.photos.search',
					api_key: api_key,
					tags: query,
					format: 'json',
				},
				dataType: 'json',
				error: err
		});

	}

	render() {
		let results;

    // if nothing has been set the the photos state yet, render empty divs.
		if (!this.state.photos[0].title) {
			results = this.state.photos.map(() => {
					return (
					<div>
					</div>
				);
			});
		}
		else {
      // if something has been set to photos state, populate with ImageItems
			results = this.state.photos.map((photo, idx) => {
					return (
					<div>
						<ImageItem idx={idx}
							photoId={photo.id}
							photoTitle={photo.title}/>
					</div>
				);
			});
		}


		return (
			<div>

        <div className="search">
  				<input
  					type="text"
  					value={this.state.query}
  					onChange={this.handleChange}
  				/>
        </div>

				<h2> {this.state.query} </h2>

        <div className="search-results-frame">


               {results}

  			</div>
      </div>
		)
		;
	}
}

export default App;
