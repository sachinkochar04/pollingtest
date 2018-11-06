import React ,{ Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Alert, Container, Row, Col, Card, CardBody, CardTitle, CardText, Button, CardHeader, CardFooter, CardDeck } from 'reactstrap';
import TopBar from './Common/TopBar.jsx'
import { auth, database } from '../Inc/firebase.js';
import { map, forEach } from 'lodash';
import { PollIcon } from 'mdi-react';
class Poll extends Component {
    constructor(props){
        super(props);
        this.state = {
            question:new Object,
            rawData:[],
            questionData:{},
            uid:'',
            error:''
        }
    }

    componentDidMount(){
        this.setState({loading:true});
        var self= this;
        database.ref('/questions/').on('value', function(snapshot) {
        let uid = auth.currentUser.uid
        let question = new Object;
        question = snapshot.val();
        let data;
        console.log('snapshot.val(): ',snapshot.val())
        self.setState({ question,rawData:snapshot.val(), uid, loading:false });
        });
    }

    onClickHandler = (i,name,uid)=>{
        let userId = auth.currentUser.uid;
        let { rawData } = this.state;
        let userData = rawData;
        ++userData.allOptions[i].poll 
        // if(!userData.usersPolled){
        //     userData.usersPolled=[]
        // }
        // userData.usersPolled.push(userId);
        console.log('userData', userData)
        this.setState({ questionData: userData })
        
    }

    onSubmitHandler = ()=>{
        let questionData = this.state.questionData;
        database.ref(`questions/`).update(questionData);
        this.setState({ error:'poll recorded'  })
        setTimeout(()=>{
            this.setState({ error:''  })
        },2000)
    }

    componentWillReceiveProps(props){
      
    }

    render() {
        let { question, uid, error, loading } = this.state;
        return(
            <div>
                <TopBar />
                {loading ? (
                    <div className="text-center m-auto">
                        <img src={require('../assets/images/spinner.gif')} />
                    </div>
                ) : (

                        <Container>
                            { error && (
                                <Alert className="alert-abs" color="success">
                                    {error}
                                </Alert>
                            )}
                            <Row className="mt-2">
                            <Col md={12} sm={12}>
                                <h2>Questions asked by Users</h2>
                                <p className="text-muted">You can poll for a question by selecting any one option ad then clicking poll.</p>
                                <hr></hr>
                            </Col>
                            <CardDeck>
                            { question.title  && (

                                <Card className={`mw-300`} >
                                <CardHeader>Questions</CardHeader>
                                    <CardBody > 
                                            <CardBody>
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
                                            </CardBody>
                                        </CardBody>
                                        <CardFooter className="text-right">
                                        <Button color="primary" className="mr-1" onClick={ () => { this.onSubmitHandler() } }><PollIcon size={16} /> Poll</Button> 
                                        {/* {
                                            polled ? (
                                                <Button color="default" className="mr-1" disabled><PollIcon size={16} /> Poll</Button> 
                                            ):(
                                            )
                                        } */}
                                        </CardFooter>
                                </Card>
                            )
                                    
                                }
                            </CardDeck>
                            </Row>
                        </Container>
                )}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    const allStates = state;
    return { allStates };
  }

export default  withRouter(connect(mapStateToProps)(Poll));
