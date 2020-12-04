import React from 'react';
import Posts from './posts'
import Aux from "../../hoc/Aux/Aux";
import Button from "../UI/Button/Button";
const client = require('../../client');

class PostsBuilder extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      posts: [],
      newPostText: "",
      showCommentId: null
    };
    this.deletePost = this.deletePost.bind(this);
    this.getPosts = this.getPosts.bind(this);
    this.createPost = this.createPost.bind(this);
    this.getComments = this.getComments.bind(this);
    this.showComments = this.showComments.bind(this);
    this.updateComments = this.updateComments.bind(this);
    this.likePost = this.likePost.bind(this);
  }

  componentDidMount() {
    this.getPosts();
  }

  getPosts() {
    client({method: 'GET', path: '/posts'}).then(response => {
      let posts = response.entity;
      this.setState({
        posts: []
      })
      posts.forEach(post => {
        this.getComments(post);
      })
      this.sortPosts();
    });
  }

  sortPosts() {
    let posts = [...this.state.posts];
    posts = posts.sort((a, b) => {
      let aDate = new Date(a.created_at);
      let bDate = new Date(b.created_at);
      return bDate - aDate;
    });
    this.setState({
      posts: posts
    })
  }

  getComments(post) {
    client({method: 'GET', path: '/comments/' + post.id}).then(response => {
      post.comments = response.entity;
      let posts = [...this.state.posts];
      posts.push(post);
      this.setState({
        posts: posts
      });
    });
  }

  updateComments(post_id) {
    client({method: 'GET', path: '/comments/' + post_id}).then(response => {
      let posts = [...this.state.posts];
      let postToUpdate = posts.find(post => post.id == post_id);
      let indexToUpdate = posts.indexOf(postToUpdate);
      postToUpdate.comments = response.entity;
      posts[indexToUpdate] = postToUpdate
      this.setState({
        posts: posts
      });
    });
  }

  showComments(post_id) {
    if(this.state.showCommentId == post_id) {
      this.setState({
        showCommentId: null
      });
    } else {
      this.setState({
        showCommentId: post_id
      });
    }
  }

  deletePost(id) {
    client({method: 'DELETE',
      path: '/posts/' + id
    }).then(response => {
      this.getPosts();
    })
  }

  likePost(id) {
      client({method: 'POST',
        path: '/likes',
        entity: {"user_id": this.props.user.id, "post_id": id },
        headers: {"Content-Type": "application/json"}
      }).then(response => {
        console.log(response);
      })
  }

  inputChangeHandler(event) {
    this.setState({
      newPostText: event.target.value
    });
  }

  createPost(event) {
    event.preventDefault();
    client({method: 'POST',
      path: '/posts',
      entity: {"content": this.state.newPostText, "user_id": this.props.user.id },
      headers: {"Content-Type": "application/json"}
    }).then(response => {
      this.getPosts();
      this.setState({
        newPostText: ""
      })
    })
  }


	render() {
		return (
		    <Aux>
          <h3>New Post</h3>
          <form onSubmit={this.createPost}>
            <textarea
                cols="80"
                rows="6"
                value={this.state.newPostText}
                onChange={(event) => this.inputChangeHandler(event)}></textarea>
            <br/>
            <Button btnType="Success">Post</Button>
          </form>
          <Posts
              user={this.props.user}
              posts={this.state.posts}
              deletePost={this.deletePost}
              likePost={this.likePost}
              showCommentId={this.state.showCommentId}
              showComments={this.showComments}
              updateComments={this.updateComments}/>
        </Aux>
		)
	}
}

export default PostsBuilder;
