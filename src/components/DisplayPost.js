import React, { Component } from "react";
import { listPosts } from '../graphql/queries'
import { API, graphqlOperation } from 'aws-amplify'
import DeletePost from "./DeletePost";
import EditPost from './EditPost';
import { onCreateComment, onCreatePost, onUpdatePost } from '../graphql/subscriptions'
import { onDeletePost } from '../graphql/subscriptions'
import CreateCommentPost from "./CreateCommentPost";
import CommentPost from "./CommentPost";


class DispalyPosts extends Component {


    state = {
        posts: []
    }

    componentDidMount = async () => {
        this.getPost();

        this.createPostListener = API.graphql(graphqlOperation(onCreatePost))
            .subscribe({
                next: postData => {
                    const newPost = postData.value.data.onCreatePost
                    const prevPost = this.state.posts.filter(post => post.id !== newPost.id);

                    const updatedPost = [newPost, ...prevPost]

                    this.setState({ posts: updatedPost })
                }
            });

        this.deletePostListner = API.graphql(graphqlOperation(onDeletePost))
            .subscribe({
                next: postData => {
                    const deletedPost = postData.value.data.onDeletePost;
                    const updatedPost = this.state.posts.filter(post => post.id !== deletedPost.id)
                    this.setState({ posts: updatedPost })
                }
            })

        this.updatePostListner = API.graphql(graphqlOperation(onUpdatePost))
            .subscribe({
                next: postData => {
                    const updatedNewPost = postData.value.data.onUpdatePost;
                    const prevPost = this.state.posts.filter(post => post.id !== updatedNewPost.id)
                    const updatedPost = [updatedNewPost, ...prevPost]
                    this.setState({ posts: updatedPost })
                }
            })

        this.updatePostCommentListner = API.graphql(graphqlOperation(onCreateComment))
        .subscribe({
            next: commentData => {
                const createComment = commentData.value.data.onCreateComment
                let posts = [...this.state.posts]

                for(let post of posts) {
                    if (createComment.post.id === post.id) {
                        post.comments.items.push(createComment)
                    }
                }
                this.setState({posts})
            }
        })
    }

    componentWillUnmount() {
        this.createPostListener.unsubscribe();
        this.deletePostListner.unsubscribe();
        this.updatePostListner.unsubscribe();
        this.updatePostCommentListner.unsubscribe();
    }

    getPost = async () => {
        const result = await API.graphql(graphqlOperation(listPosts));
        // console.log('All Posts: ', result.data.listPosts.items);
        this.setState({ posts: result.data.listPosts.items })
    }

    render() {
        const { posts } = this.state;
        return posts.map((post) => {
            return <div className="posts" key={post.id}>
                <h1>{post.postTitle}</h1>
                <span>
                    {"wrote by: "} {post.postOwnerUsername}
                    {" on "}
                    <time>
                        {" "}
                        {new Date(post.createdAt).toDateString()}
                    </time>
                </span>
                <div>
                    {"post body: "}<br>
                    </br>
                    {post.postBody}
                </div>

                <br>
                </br>
                <span>
                    <DeletePost data={post} />
                    <EditPost {...post} />
                </span>
                <span>
                    <CreateCommentPost postId={post.id} />
                    {post.comments.items.length > 0 && <span style={{fontSize: '19px'}}>
                        comments: 
                         </span>}
                         {
                             post.comments.items.map((comment, index) => <CommentPost key={index} commentData = {comment}/>)
                         }
                </span>
            </div>
        })
    }
}

export default DispalyPosts;