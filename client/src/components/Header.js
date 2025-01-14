import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Timer from './XcashContainer/Timer';
import xcash_logo from '../xcash-logo.png';
import Prices from './ConversionContainer/ConversionContainer';
import axios from 'axios';
import { React, PureComponent } from 'react';
import version from '../version.json';

class Header extends PureComponent {
    constructor(props) {
        super(props);
        this.remoteVersion = version.version;
        this.state = {
            ticker: true
        };
    }

    componentDidMount() {
        this.getSettings();
        this.getVersion();
    }

    /**
     * get settings from the server.
     */
    getSettings = async () => {
        try {
            const result = await axios({
                method: 'GET',
                url: '/settings'
            });

            this.setState({
                ticker: result.data.TICKER === 'true'
            });
        } catch (err) {
            console.error('Error fetching xcash data', err);
        }
    };

    /**
     * get latest version info from github.
     */
    getVersion = async () => {
        try {
            const result = await axios({
                method: 'GET',
                url: `https://raw.githubusercontent.com/element0355/xcash-dashboard/main/version.json`
            });

            this.remoteVersion = result.data.version;
        } catch (err) {
            console.error('Error fetching version data', err);
        }
    };

    render() {
        const props = this.props;
        const update = props.info.update_avilable ? 'Yes! ' : 'not today...';
        const busy = props.info.busy_syncing ? 'Yes, catching up.' : 'Nope, up to date.';
        const { ticker } = this.state;

        return (
            <Jumbotron>
                <Container>
                    <Row>
                        <Col md="8">
                            <h1>
                                <img src={xcash_logo} className="logo" /> Dashboard
                            </h1>
                            <Container>
                                <Row>
                                    <Col md="4">X-CASH Node Version:</Col>
                                    <Col>{props.xversion.version}</Col>
                                </Row>
                                <Row>
                                    <Col md="4">Update Available:</Col>
                                    <Col>{update}</Col>
                                </Row>
                                <Row>
                                    <Col md="4">Connected to:</Col>
                                    <Col>{props.info.nettype}</Col>
                                </Row>
                                <Row>
                                    <Col md="4">Busy Syncing:</Col>
                                    <Col>{busy}</Col>
                                </Row>
                                <Row>
                                    <Col md="4">Dashboard Version:</Col>
                                    <Col md="2">v{version.version}</Col>
                                    {(() => {
                                        if (version.version !== this.remoteVersion) {
                                            return (
                                                <Col>
                                                    <a
                                                        href="https://github.com/element0355/xcash-dashboard"
                                                        target="_blank"
                                                    >
                                                        Update Available!
                                                    </a>
                                                    &nbsp;-&nbsp; (v{this.remoteVersion})
                                                </Col>
                                            );
                                        }
                                    })()}
                                </Row>
                                <Row>
                                    <Col />
                                </Row>
                                <Row>
                                    <Col md="3">
                                        <Timer />
                                    </Col>
                                </Row>
                            </Container>
                        </Col>
                        <Col md="4">
                            {(() => {
                                if (ticker) {
                                    return <Prices />;
                                }
                            })()}
                        </Col>
                    </Row>
                </Container>
            </Jumbotron>
        );
    }
}

export default Header;
