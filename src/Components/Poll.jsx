import React ,{ Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Alert, Container, Row, Col, Card, CardBody, CardTitle, Button, CardHeader, CardFooter, CardDeck } from 'reactstrap';
import TopBar from './Common/TopBar.jsx'
import { auth, database } from '../Inc/firebase.js';
import { PollIcon } from 'mdi-react';
class Poll extends Component {
    constructor(props){
        super(props);
        this.state = {
            question:{},
            rawData:[],
            questionData:{},
            uid:'',
            message:''
        }
    }

    componentDidMount(){
        this.setState({loading:true});
        var self= this;
        database.ref('/questions/').on('value', function(snapshot) {
        let uid = auth.currentUser.uid
        if(snapshot.val()){
            let question = {};
            question = snapshot.val();
            self.setState({ question,rawData:snapshot.val(), uid, loading:false });
        }else{
            self.setState({ loading:false });
        }
        });
    }

    onClickHandler = (i,name,uid)=>{
        let { rawData } = this.state;
        let userData = rawData;
        ++userData.allOptions[i].poll 
        this.setState({ questionData: userData })
        
    }

    onSubmitHandler = ()=>{
        let questionData = this.state.questionData;
        database.ref(`questions/`).update(questionData);
        this.setState({ message:'poll recorded'  })

    }

    componentWillUnmount(){
        database.ref('/questions/').off();
    }

    render() {
        let { question, message, loading } = this.state;
        return(
            <div>
                <TopBar />
                {loading ? (
                    <div className="text-center m-auto">
                        <img src={require('../assets/images/spinner.gif')} alt="loading..." />
                    </div>
                ) : (

                        <Container>
                            { message && (
                                <Alert className="alert-abs" color="success">
                                    {message}
                                </Alert>
                            )}
                            <Row className="mt-2">
                            <Col md={12} sm={12}>
                                <h2>Questions asked by Users</h2>
                                <p className="text-muted">You can poll for a question by selecting any one option ad then clicking poll.</p>
                                <hr></hr>
                            </Col>
                            <CardDeck>

                                <Card className={`mw-300`} >
                                <CardHeader>Questions</CardHeader>
                                    <CardBody > 
                                                { question.title ? (
                                                    <>
                                                        <CardTitle>{`${question.title} ?`}</CardTitle>
                                                        
                                                            <ul className="list-style-none">    
                                                                {question.allOptions.map((option,oi)=>{
                                                                    return(
                                                                        <li key={ oi }>
                                                                            <input name="option" type="radio" onClick={ (e)=>{ this.onClickHandler(oi,e.target.name,question.userId) } } />
                                                                            { ` ${option.title}` }</li>
                                                                    )
                                                                })}
                                                            </ul>
                                                        </>
                                                ) : (
                                                    <div>
                                                        <p className="text-muted">No Question Created Yet</p>
                                                    </div>
                                                ) }
                                        </CardBody>
                                        <CardFooter className="text-right">
                                            {question.title && (<Button color="primary" className="mr-1" onClick={ () => { this.onSubmitHandler() } }><PollIcon size={16} /> Poll</Button>)} 
                                      
                                        </CardFooter>
                                </Card>
                            </CardDeck>
                            </Row>
                        </Container>
                )}
            </div>
        )
    }
}


export default  withRouter(Poll);
