import React, {Component} from 'react'
import {deletePost} from '../graphql/mutations'
import {API, graphqlOperation} from 'aws-amplify'

class DeletePost extends Component {

    // deletePost = (event) => {
    //     event.preventDefault;

    // }

    handleDelete = async postId => {
        const input = {
            id: postId
        }
        await API.graphql(graphqlOperation(deletePost, {input}))
    }
    render() {
        const post = this.props.data;
        return (
            <button className={'deleteButton'} onClick={ () => this.handleDelete(post.id)}>DELETE</button>
        )
    }
}

export default DeletePost;