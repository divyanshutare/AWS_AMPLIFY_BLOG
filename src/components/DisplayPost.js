import React, { Component } from "react";
import { listPosts } from '../graphql/queries'
import { API, Auth, graphqlOperation } from 'aws-amplify'
import DeletePost from "./DeletePost";
import EditPost from './EditPost';
import { onCreateComment, onCreateLike, onCreatePost, onUpdatePost } from '../graphql/subscriptions'
import { onDeletePost } from '../graphql/subscriptions'
import CreateCommentPost from "./CreateCommentPost";
import CommentPost from "./CommentPost";
import{FaSadTear, FaThumbsUp} from 'react-icons/fa'
import { createLike } from "../graphql/mutations";
import UsersWhoLikePost from "./UsersWhoLikePost";


class DispalyPosts extends Component {


    state = {
        ownerId: '',
        ownerUsername: '',
        isHovering: false,
        posts: [],
        errorMessage: "",
        postLikedBy: []
    }

    componentDidMount = async () => {
        this.getPost();

        await Auth.currentUserInfo()
        .then( user => {
            this.setState({
                ownerId: user.attributes.sub,
                ownerUsername: user.username
            })
        })

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

        this.createPostLikeListner = API.graphql(graphqlOperation(onCreateLike))
        .subscribe({
            next: postData => {
                const createdLike = postData.value.data.onCreateLike;

                let posts = [...this.state.posts]
                for(let post in posts) {
                    if (createdLike.post.id === post.id) {
                        posts[post].createdLike.items.push(createdLike)
                    }
                }
                this.setState({posts})
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
        this.createPostLikeListner.unsubscribe();
    }

    handleMouseHover = async postId => {
        this.setState({isHovering: !this.state.isHovering});
        let innerLikes = this.state.postLikedBy;
        for(let post of this.state.posts) {
            if (post.id === postId) {
                for( let like of post.likes.items) {
                    innerLikes.push(like.likeOwnerUsername)
                }
            }
            this.setState({postLikedBy: innerLikes})
        }
        // console.log('post likes by', this.state.postLikedBy)
    }

    getPost = async () => {
        const result = await API.graphql(graphqlOperation(listPosts));
        // console.log('All Posts: ', result.data.listPosts.items);
        this.setState({ posts: result.data.listPosts.items })
    }

    handleMouseLeave = async () => {
        this.setState({
            isHovering: !this.state.isHovering
        })
        this.setState({
            postLikedBy: []
        })
    }

    likedPost = (postId) => {
        for(let post of this.state.posts) {
            if (post.id === postId) {
                if (post.postOwnerId === this.state.ownerId) return true;
                for(let like of post.likes.items) {
                    if (like.likeOwnerId === this.state.ownerId) {
                        return true
                    }
                }
            }
        }
        return false
    }

    handleLike = async postId => {
        if (this.likedPost(postId)) {
            return this.setState({errorMessage: "You can't klike this post"})
        } else {
            const input = {
                numberLikes: 1,
                likeOwnerId: this.state.ownerId,
                likeOwnerUsername: this.state.ownerUsername,
                likePostId: postId
            }
    
            try {
                const result = await API.graphql(graphqlOperation(createLike, {input}))
                console.log("liked: ", result.data)
            } catch(e){
                console.log(e)
            } 
        }
     }

    render() {
        const { posts } = this.state;
        let loggedInUser = this.state.ownerId;
        

        
        return posts.map((post) => {
            // console.log("if : ", post, " ", loggedInUser, " ", post.postOwnerId === loggedInUser)
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
                    {
                    post.postOwnerId === loggedInUser &&
                        <DeletePost data={post} />
                    }
                    {post.postOwnerId === loggedInUser &&
                        <EditPost {...post} />

                    }
                    <span>
                        <p className="alert"> {post.postOwnerId === loggedInUser && this.state.errorMessage}</p>
                        <p 
                        onMouseEnter= {() => this.handleMouseHover(post.id)}
                        onMouseLeave={()=> this.handleMouseLeave()}
                        onClick={ () => this.handleLike(post.id) }
                        style={{color: (post.likes.items.length > 0)? 'blue': 'gray'}}
                        className="like-button">
                            <FaThumbsUp /> 
                            {post.likes.items.length}
                        </p>
                        {
                            this.state.isHovering && 
                            <div className="users-like">
                                {
                                    this.state.postLikedBy.length === 0? "liked by no one" : "Liked by: "}
                                    {this.state.postLikedBy.length === 0 ? 
                                    <FaSadTear /> : <UsersWhoLikePost data={this.state.postLikedBy} />
                                }
                            </div>
                        }
                    </span>
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