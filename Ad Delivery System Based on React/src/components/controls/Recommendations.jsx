import React from 'react';
import PropTypes from 'prop-types';
import CancelOnUnmount from '../../services/CancelOnUnmount.js'
import CampaignCoreSettingsRecommendationService from '../../services/CampaignCoreSettingsRecommendationService';
import CampaignGeoRecommendationService from '../../services/CampaignGeoRecommendationService';
import CampaignAdFormatRecommendationService from '../../services/CampaignAdFormatRecommendationService';
import Loader from './Loader.jsx'
import './Recommendations.scss'

export default class Recommendations extends React.Component {
    static propTypes = {
        recommendationType: PropTypes.oneOf([
            'CAMPAIGN_CORE_SETTINGS_RECOMMENDATIONS',
            'CAMPAIGN_GEO_RECOMMENDATIONS',
            'CAMPAIGN_ADFORMAT_RECOMMENDATIONS'
        ]).isRequired,
        campaignId: PropTypes.string.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            newRecommendationText: '',
            recommendations: [],
         
            isGetData: false
        };

        this.handleAddRecommendation = this.handleAddRecommendation.bind(this);
        this.handleTextAreaChanged = this.handleTextAreaChanged.bind(this);
    }

    componentDidMount() {
        if (this.props.recommendationType === 'CAMPAIGN_CORE_SETTINGS_RECOMMENDATIONS') {
            CancelOnUnmount.track(this, CampaignCoreSettingsRecommendationService
                .getAllRecommendations(this.props.campaignId)
                .then(recommendations => {
                    this.setState({
                        recommendations: recommendations,
                        isGetData: true
                    })
                }));
        } else if (this.props.recommendationType === 'CAMPAIGN_GEO_RECOMMENDATIONS') {
            CancelOnUnmount.track(this, CampaignGeoRecommendationService
                .getAllRecommendations(this.props.campaignId)
                .then(recommendations => {
                    this.setState({
                        recommendations: recommendations,
                        isGetData: true
                    })
                }));

        } else if (this.props.recommendationType === 'CAMPAIGN_ADFORMAT_RECOMMENDATIONS') {
            CancelOnUnmount.track(this, CampaignAdFormatRecommendationService
                .getAllRecommendations(this.props.campaignId)
                .then(recommendations => {
                    this.setState({
                        recommendations: recommendations,
                        isGetData: true
                    })
                }));
        }
    }

    componentWillUnmount() {
        CancelOnUnmount.handleUnmount(this);
    }

    handleTextAreaChanged(e) {
        this.setState({ newRecommendationText: e.target.value });
    }


    handleAddRecommendation() {
        const {newRecommendationText} = this.state;
        if (newRecommendationText === '') {
          return false
        }
        this.setState({ newRecommendationText: '' });

        if (this.props.recommendationType === 'CAMPAIGN_CORE_SETTINGS_RECOMMENDATIONS') {
            // CancelOnUnmount.track(this, CampaignCoreSettingsRecommendationService
            //     .addRecommendation(this.props.campaignId, newRecommendationText )
            //     .then(recommendation => {
            //         this.setState({ recommendations: this.state.recommendations.concat(recommendation) })
            //     })
            //     .catch(() => {
            //         alert('Couldn\'t add recommendation, please try again.');
            //     }));
            this.addRecommendation(this, CampaignCoreSettingsRecommendationService, this.props.campaignId, newRecommendationText)
                .then(recommendation => {
                    this.setState({ recommendations: this.state.recommendations.concat(recommendation) })
                })
                .catch(() => {
                    alert('Couldn\'t add recommendation, please try again.');
                });
        } else if (this.props.recommendationType === 'CAMPAIGN_ADFORMAT_RECOMMENDATIONS') {
            this.addRecommendation(this, CampaignAdFormatRecommendationService, this.props.campaignId, newRecommendationText)
            .then(recommendation => {
                this.setState({ recommendations: this.state.recommendations.concat(recommendation) })
            })
            .catch(() => {
                alert('Couldn\'t add recommendation, please try again.');
            });

            // CancelOnUnmount.track(this, CampaignAdFormatRecommendationService
            //     .addRecommendation(this.props.campaignId, recommendationText )
            //     .then(recommendation => {
            //         this.setState({ recommendations: this.state.recommendations.concat(recommendation) })
            //     })
            //     .catch(() => {
            //         alert('Couldn\'t add recommendation, please try again.');
            //     }));
        } 
    }

    addRecommendation = (context, serviceName, campaignId, recommendationText) => {
        return new Promise(function (resolve, reject) {
            CancelOnUnmount.track(context, serviceName
            .addRecommendation(campaignId, recommendationText )
            .then(recommendation => {
                resolve(recommendation)
                //this.setState({ recommendations: //this.state.recommendations.concat(recommendation) })
            })
            .catch(() => {
                reject()
                alert('Couldn\'t add recommendation, please try again.');
            }));
        })
    }
    

    renderSingleRecommendation(id, recommendationText, username, index) {
        return (
            <div key={id} className="recommendations__single" style={{position:'relative'}}>
                <h4>{username}</h4>
                <p>
                    {recommendationText}
                </p>
                <span className='close' onClick={this.delRecommendationAction.bind(this, index)}>
                    X
                </span>
            </div>
        );
    }


    delRecommendationAction = (index) => {
        let {recommendations} = this.state
        recommendations.splice(index, 1)
        this.setState({
            recommendations
        })
    }

    // renderAdFormatRecommendations() {
    //     return (
    //         <div className="recommendations">
    //             <div>
    //                 {this.state.recommendations.map((r, index) => this.renderSingleRecommendation(r.id, r.suggestion, r.username, index))}
    //                 <div style={{clear:'both'}}></div>
    //             </div>
    //             <div>
    //                 <div className='text-container'>
    //                     <textarea value={this.state.newRecommendationText} onChange={this.handleTextAreaChanged}/>
    //                 </div>
    //                 <div className='btn-container'>
    //                     <button onClick={this.handleAddRecommendation}>Add</button>
    //                 </div>
    //             </div>
    //         </div>
    //     );
    // }

    // renderGeoRecommendations() {
    //     return (
    //         <div className="recommendations">
    //             <div>
    //                 {this.state.recommendations.map(r => this.renderSingleRecommendation(r.auto_optimizer_id, r.auto_optimizer_explanation, 'auto_optimizer'))}
    //             </div>
    //         </div> 
    //     );
    // }


    compare = (keyName) => {
        // sort
        return (obj1, obj2) => {
            var val1 = obj1[keyName].toLowerCase();
            var val2 = obj2[keyName].toLowerCase();
            console.log(val1)
            if (val1 < val2) {
                return -1;
            } else if (val1 > val2) {
                return 1;
            } else {
                return 0;
            }            
        } 
    }

    getRecommendationHtml = (isAdd, id, text, username) => {
      let {isGetData, recommendations} = this.state;
      let newRecommendations = recommendations.sort(this.compare(text))
      if (isGetData) {
        if (isAdd) {
          return (
            <div>
              {this.props.children}
              <div className="recommend-list">
                  {newRecommendations.map((r, index) => this.renderSingleRecommendation(r[id], r[text], r[username], index))}
              </div>
              <div style={{clear: 'both'}}></div>
              <div>
                  <div className='text-container'>
                      <textarea style ={{width: '278px'}}value={this.state.newRecommendationText} onChange={this.handleTextAreaChanged}/>
                  </div>
                  <div className='btn-container'>
                      <button onClick={this.handleAddRecommendation}>Add</button>
                  </div>
              </div>
            </div>
          )
        }else {
          return (
            <div>
              {this.props.children}
              <div className="recommend-list">
                  {newRecommendations.map((r, index) => this.renderSingleRecommendation(r[id], r[text], r[username], index))}
              </div>
              <div style={{clear: 'both'}}></div>
            </div>
          )
        }
      } else {
        return (
          <div style={{position: 'relative'}}>
            <Loader/>
          </div>
        )
      }
    }

    render() {
        let {isGetData} = this.state;
        let recommendHtml;
        if (this.props.recommendationType === 'CAMPAIGN_GEO_RECOMMENDATIONS') {
            // return this.renderGeoRecommendations();
            recommendHtml = this.getRecommendationHtml(false, 'auto_optimizer_id', 'auto_optimizer_explanation', 'username')
        } else if (this.props.recommendationType === 'CAMPAIGN_ADFORMAT_RECOMMENDATIONS') {
            // return this.renderAdFormatRecommendations();
            recommendHtml = this.getRecommendationHtml(true, 'id', 'suggestion', 'username') 
        } else {
          recommendHtml = this.getRecommendationHtml(true, 'id', 'text', 'username')
        }
        return (
          <div className="recommendations">
             {recommendHtml}
          </div>
      );
    }
}