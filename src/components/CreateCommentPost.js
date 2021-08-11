import React, {Component} from 'react'
import { API, Auth, graphqlOperation } from 'aws-amplify'
import {createComment} from '../graphql/mutations'


class CreateCommentPost extends Component {
    
    state = {
        commnetOwnerID: '',
        commentOwnerUsername: '',
        content: ""
    }
    
    componentDidMount = async () => {
        await Auth.currentUserInfo()
        .then(user => {
            this.setState({
                commnetOwnerID: user.attributes.sub,
                commentOwnerUsername: user.username
            })
        })
    }

    handleChangeContent = e => {
        this.setState({
            content: e.target.value
        })
    }

    handleAddComment = async (e) => {
        e.preventDefault();
        const input = {
            commentPostId: this.props.postId,
            commentOwnerId: this.state.commnetOwnerID,
            commentOwnerUsername: this.state.commentOwnerUsername,
            content: this.state.content,
            createAt: new Date().toISOString
        }
        await API.graphql(graphqlOperation(createComment, {input}))

        this.setState({
            content: "" // clear Field
        })
    }

    render(){
        return(
            <div>
                <form className="add-comment"
                onSubmit={this.handleAddComment}>
                    <textarea
                    type="text"
                    name="content"
                    rows="3"
                    cols="40"
                    required
                    placeholder="Add your Comment..."
                    value={this.state.content}
                    onChange={this.handleChangeContent} />
                    <input 
                    className="btn"
                    style={{fontSize:'19px'}}
                    value="Add Comment"
                    type="submit" />
                </form>
            </div>
        )
    }
}

export default CreateCommentPost;