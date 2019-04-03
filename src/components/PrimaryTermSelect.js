import { Fragment, Component } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const { withSelect, withDispatch } = wp.data;

const DEFAULT_QUERY = {
	per_page: -1,
	orderby: 'name',
	order: 'asc',
	_fields: 'id,name,parent',
};

const withPrimaryTermSelect = (WrappedComponent, taxonomy) => {
    return class HierarchicalTermSelectorWithPrimary extends Component {
        constructor(props) {
            super(props);
            this.state = {
                loading: true,
                terms: [],
                availableTerms: [],
                primaryTermId: null
            };
            this.onUpdateTerms = this.onUpdateTerms.bind(this);
        }

        componentDidMount() {
            this.fetchTerms();
        }

        fetchTerms() {
            const { taxonomy } = this.props;
            if ( ! taxonomy ) {
                return;
            }
            apiFetch( {
                path: addQueryArgs( `/wp-json/wp/v2/${ taxonomy.rest_base }`, DEFAULT_QUERY ),
            } ).then(
                ( terms ) => {
                    this.setState( {
                        loading: false,
                        availableTerms: terms,
                    } );
                },
                ( xhr ) => { // reject
                    if ( xhr.statusText === 'abort' ) {
                        return;
                    }
                    this.setState( {
                        loading: false,
                    } );
                }
            );
        }

        onUpdateTerms(...args) {
            this.setState({ terms: args[0] });
            this.props.onUpdateTerms(...args);
        }

        render() {
            const { terms, taxonomy, metaFieldValue } = this.props;
            const { availableTerms } = this.state;
            const options = availableTerms
                .filter(term => terms.includes(term.id))
                .map(term => ({ label: term.name, value: term.id }));

            return (
                <Fragment>
                    <WrappedComponent {...this.props} onUpdateTerms={this.onUpdateTerms} />
                    <SelectControl
                        label={ __(`Primary ${taxonomy.labels.singular_name}`) }
                        noOptionLabel={ __(`Select a ${taxonomy.labels.singular_name}`) }
                        onChange={ this.props.setMetaFieldValue }
                        value={ metaFieldValue }
                        options={ options }
                    />
                </Fragment>
            )
        }
    }
}

const mapSelectToProps = ( select, props ) => {
    const { slug } = props;
    return {
        metaFieldValue: select('core/editor')
            .getEditedPostAttribute('meta')
            [`_bjh_primary_${slug}`]
    }
};

const mapDispatchToProps = ( dispatch, props ) => {
    const { slug } = props;
    return {
        setMetaFieldValue: ( value ) => {
            dispatch( 'core/editor' ).editPost(
                { meta: { [`_bjh_primary_${slug}`]: value } }
            );
        }
    }
}

const addPrimaryTermSelect = (OriginalComponent, props) => {
    const HierarchicalTermSelectorWithPrimary = withPrimaryTermSelect(OriginalComponent);
    const HierarchicalTermSelectorWithPrimaryAndData = withSelect( mapSelectToProps )( HierarchicalTermSelectorWithPrimary );
    const HierarchicalTermSelectorWithPrimaryAndDataAndActions = withDispatch( mapDispatchToProps )( HierarchicalTermSelectorWithPrimaryAndData );
    return <HierarchicalTermSelectorWithPrimaryAndDataAndActions {...props} />;
}

export default addPrimaryTermSelect;