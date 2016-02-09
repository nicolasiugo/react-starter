import fetch from 'isomorphic-fetch';
import * as types from '../constants/ActionTypes';


export function saveFuelSavings(settings) {
	return { 
		type: types.SAVE_FUEL_SAVINGS, 
		settings 
	};
}

export function calculateFuelSavings(settings, fieldName, value) {
	return { 
		type: types.CALCULATE_FUEL_SAVINGS, 
		settings, 
		fieldName, 
		value 
	};
}

function requestPosts(subreddit) {
	return {
		type: types.REQUEST_POSTS,
		subreddit
	};
}

function receivePosts(subreddit, json) {
	return {
		type: types.RECEIVE_POSTS,
		subreddit,
		posts: json.data.children.map(child => child.data),
		receivedAt: Date.now()
	};
}


function shouldFetchPosts(state, subreddit) {

	//const posts = state.postsBySubreddit[subreddit];
	const posts = null;
	if (!posts) {
		return true;
	} else if (posts.isFetching) {
		return false;
	} else {
		return posts.didInvalidate;
	}
}


function fetchPosts(subreddit) {

	return dispatch => {
		dispatch(requestPosts(subreddit));
		return fetch(`http://www.reddit.com/r/${subreddit}.json`)
			.then(req => req.json())
			.then(json => dispatch(receivePosts(subreddit, json)));
		// TODO: catch any error in the network call.
	};
}




export function fetchPostsIfNeeded(subreddit) {
	// Note that the function also receives getState()
	// which lets you choose what to dispatch next.

	// This is useful for avoiding a network request if
	// a cached value is already available.

	return (dispatch, getState) => {
		if (shouldFetchPosts(getState(), subreddit)) {
			return dispatch(fetchPosts(subreddit));
		} else {
			// Let the calling code know there's nothing to wait for.
			return Promise.resolve();
		}
	};
}
