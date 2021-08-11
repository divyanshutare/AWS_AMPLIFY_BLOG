import { API, Auth, graphqlOperation } from 'aws-amplify';
import  {Component} from 'react';
import { createPost } from '../graphql/mutations';


class CreatePost extends Component {

    state = {
        postOwnerId: "",
        postOwnerUsername:"",
        postTitle: "",
        postBody: "",
        createdAt: ""
    }

    componentDidMount = async () => {
        await Auth.currentAuthenticatedUser().then(user => {
            // console.log('current user ', user)
            this.setState({postOwnerUsername: user.username,
            postOwnerId: user.attributes.sub})
        })
        
    }

    handleAddPost = async event => {
        event.preventDefault();
        const input = {
            postOwnerId: this.state.postOwnerId,
            postOwnerUsername:  this.state.postOwnerUsername,
            postTitle: this.state.postTitle,
            postBody: this.state.postBody,
            createdAt: new Date().toISOString
        }

        await API.graphql(graphqlOperation(createPost, {input}))
        this.setState({postTitle: "", postBody: ""})
    }

    handelPostChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    render() {
        return (
            <form className="add-post" onSubmit={this.handleAddPost}>
                <input style={{font: "19px"}}
                type="text" placeholder="text"
                name="postTitle"
                required
                value={this.state.postTitle}
                onChange={this.handelPostChange}
                />

                <textarea
                    type = "text" placeholder="New Blog Post"
                    name="postBody"
                    rows="3"
                    cols="40"
                    value={this.state.postBody}
                    onChange = {this.handelPostChange}
                    required
                />
                <input type='submit'
                    className="btn"
                    style={{fontSize: '19px'}}
                />
            </form>
        )
    }
}

export default CreatePost;