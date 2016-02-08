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
	const posts = state.postsBySubreddit[subreddit];
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
	};
}


export function fetchPostsIfNeeded(subreddit) {
	return (dispatch, getState) => {
		if (shouldFetchPosts(getState(), subreddit)) {
			return dispatch(fetchPosts(subreddit));
		}
	};
}