import React from 'react';
import Post from './post'
import client from '../../client';

class Posts extends React.Component {
  constructor(props) {
    super(props);
    this.getPosts = this.getPosts.bind(this);
  }

	render() {
		return (
      <article className='posts-main'>
        <h1 className='posts-title'>
          Posts
        </h1>
  			<div className='posts-items'>
  				{this.getPosts()}
  			</div>
      </article>
		)
	}

  getPosts() {
    return this.props.posts.map(post =>
			<Post
          key={post.id}
          user={this.props.user}
          post={post}
          deletePost={() => this.props.deletePost(post.id)}
          likePost={() => this.props.likePost(post.id)}
          likes={post.likes}
          comments={post.comments}
          displayComments={post.id == this.props.showCommentId}
          showComments={() => this.props.showComments(post.id)}
          updateComments={this.props.updateComments}
          />
		);
  }
}

export default Posts;
