import { API, Auth, graphqlOperation } from 'aws-amplify';
import React, {Component} from 'react';
import { updatePost } from '../graphql/mutations';

class EditPost extends Component {
    state = {
        show: false,
        id: "",
        postOwerID: "",
        postOwnerUsername: "",
        postTitle: "",
        postBody: "",
        postData: {
            postTitle: this.props.postTitle,
            postBody: this.props.postBody
        },

    }

    componentDidMount = async () => {
        await Auth.currentUserInfo()
            .then(user => {
                // console.log(user)
                this.setState({
                    postOwerID: user.attributes.sub,
                    postOwnerUsername: user.username,

                })
            })
    }

    handleModal = () => {
        this.setState({
            show: !this.state.show
        })
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }


    handleTitle = (event) => {
        this.setState({
            postData: {...this.state.postData, postTitle: event.target.value}
        })
    }

    handleBody = (event) => {
        this.setState({
            postData: {...this.state.postData, postBody: event.target.value}
        })
    }

    handleUpdatePost = async (event) => {
        event.preventDefault();
        // console.log(this.props.data)
        const input = {
            id: this.props.id,
            postTitle: this.state.postData.postTitle,
            postBody: this.state.postData.postBody,
            postOwnerId: this.state.postOwnerId,
            postOwnerUsername: this.state.postOwnerUsername
        }
        await API.graphql(graphqlOperation(updatePost, {input}))
        this.setState({
            show: false
        })
    }

    render() {
        return (
            <>
                {
                    this.state.show && (
                        <div className="modal">
                            <button className="close"
                                onClick={this.handleModal}>
                                X
                            </button>
                            <form className="add-post"
                                onSubmit={(event) => this.handleUpdatePost(event)}>
                                    <input style={{fontSize: "19px"}}
                                        text="text" placeholder="title"
                                        name="postTitle"
                                        value={this.state.postData.postTitle}
                                        onChange={this.handleTitle}/>
                                    
                                    <input 
                                    style={{height: "150px", fontSize: "19px"}}
                                    type="text"
                                    name="postBody"
                                    placeholder="body"
                                    value={this.state.postData.postBody}
                                    onChange={this.handleBody}/>

                                    <button type="submit">
                                        Update
                                    </button>
                                </form>
                        </div>
                    )
                }
                <button onClick={this.handleModal}> Edit</button>
            </>
        )
    }
}

export default EditPost;