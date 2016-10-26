import React from 'react';
import {desuckify, api_key} from './util';
import * as $ from 'jquery';

class ImageItem extends React.Component {
		constructor(props) {
			super(props);
			this.fetchPicUrl = this.fetchPicUrl.bind(this);

			this.state = {
				img_url: "",
				title: ""
			};
		}


		componentDidMount() {
			let {photoId, photoTitle} = this.props;
			this.fetchPicUrl(photoId, photoTitle);
		}

		// any time we receive to props, we need to update
		// the image url to the new photoId
		componentWillReceiveProps(nextProps) {
			let {photoId, photoTitle} = nextProps;
			this.fetchPicUrl(photoId, photoTitle);
		}

		// calls flickr getSizes endpoint which returns image assets
		// based on photoId
		fetchPicUrl(photoId, title) {

			const photoReceived = (photoSizes) => {
				photoSizes = desuckify(photoSizes);
				const src = photoSizes.sizes.size[5].source;
				this.setState({img_url: src, title});
			};

			const err = data => console.log(`ERROR: ${data}`);

				$.ajax({
					url: `https://api.flickr.com/services/rest`,
					method: 'GET',
					data: {
						method: 'flickr.photos.getSizes',
						api_key,
						photo_id: photoId,
						format: 'json'
					},
					success: photoReceived,
					error: err

				});
		}

		render() {
			return (
				<div className="search-result">
					<img src={this.state.img_url} />
					<p>{this.state.title}</p>
				</div>
			);
		}

}
export default ImageItem;
