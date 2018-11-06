import React ,{ Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Container, Row, Col, Card, CardBody, CardTitle, CardDeck, CardText, Button, CardHeader  } from 'reactstrap';
import TopBar from './Common/TopBar.jsx'
import { auth, database } from '../Inc/firebase.js';

class Stats extends Component {
    constructor(props){
        super(props);
        this.state = {
            loading:false,
            question:'',
        }
    }

    componentDidMount(){
        this.setState({loading:true});
        var self= this;
        database.ref('/questions/').on('value', function(snapshot) {
        let uid = auth.currentUser.uid
        let question = new Object;
        question = snapshot.val();
        console.log('snapshot.val(): ',snapshot.val())
        self.setState({ question,rawData:snapshot.val(), uid, loading:false });
        });
    }

    render() {
        let { loading, question } = this.state;
        return(
            <div>
                <TopBar />
                <Container>
                    {loading ? (
                        <div className="text-center m-auto">
                            <img src={require('../assets/images/spinner.gif')} />
                        </div>
                    ) : (
                        <Row className="mt-2">
                            <Col md={12} sm={12}>
                                <h1>Stats</h1>
                                <hr></hr>
                            </Col>
                            <Col md={12} sm={12}>
                                <h3>Question:- <span class="text-muted">{ question && question.title }</span></h3>
                            </Col>
                            <CardDeck>

                                {question.allOptions && question.allOptions.map((option,i)=>{
                                    return(
                                                <Card  width="100%">
                                                    <CardBody>
                                                        <CardTitle>Option:-{ option.title }</CardTitle>
                                                        <CardText>Polls:- { option.poll }</CardText>
                                                    </CardBody>
                                                </Card>
                                    )
                                }) 

                                }
                            </CardDeck>
                        </Row>
                    )}
                </Container>
            </div>
        )
    }
}

export default withRouter(Stats);