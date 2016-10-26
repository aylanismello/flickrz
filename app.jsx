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

	handleChange(event) {

		if(this.timeoutId)
			window.clearTimeout(this.timeoutId);

		let theQuery = event.target.value;

		this.timeoutId = window.setTimeout(() => {
			this.updatePics(theQuery);
		}, 400);

		this.setState({query: theQuery});


  }

	updatePics(query) {

		if (!query) {
			this.setState({query});
			return;
		}

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

		if (!this.state.photos[0].title) {
			results = this.state.photos.map(() => {
					return (
					<div>
					</div>
				);
			});
		}
		else {
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

          <Masonry
               className={'search-results'} // default ''
               elementType={'div'} // default 'div'
               disableImagesLoaded={false} // default false
               updateOnEachImageLoad={true} // default false and works only if disableImagesLoaded is false
           >
               {results}
           </Masonry>

  			</div>
      </div>
		)
		;
	}
}

export default App;
