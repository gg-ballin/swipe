import React, { Component } from 'react';
import { 
    View, 
    Animated, 
    PanResponder,
    Dimensions
} from 'react-native';
 
 
const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.35 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;
 
class Deck extends Component {
    static defaultProps = {
        onSwipeRight: () => {},
        onSwipeLeft: () => {}
    };
 
    constructor(props) {
        super(props);
 
        const position = new Animated.ValueXY();
 
        const panResponder = PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: (event, gesture) => {
                position.setValue({ x: gesture.dx, y: gesture.dy });
                
            },
            onPanResponderRelease: (event, gesture) => {
                if (gesture.dx > SWIPE_THRESHOLD) {
                    this.forceSwipe('right');
                } else if (gesture.dx < -SWIPE_THRESHOLD) {
                    this.forceSwipe('left');
                } else {
                    this.resetPosition();
                }
                
            }
        });
 
        // used to animate smooth transition of the rest of the deck
        const position2 = new Animated.ValueXY();
 
        this.state = { panResponder, position, index: 0, position2 };
 
        
    }
 
    componentWillReceiveProps(nextProps) {
        if (nextProps.data !== this.props.data) {
            this.setState({ index: 0 });
        }
    }
 
    forceSwipe(direction) {
        const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH
 
        Animated.timing(this.state.position, {
            toValue: { x, y: 0 },
            duration: SWIPE_OUT_DURATION
 
        }).start(() => {
            // callback function
            this.onSwipeComplete(direction);
        });
    }
 
    onSwipeComplete(direction) {
        const { onSwipeLeft, onSwipeRight, data } = this.props;
        const item = data[this.state.index];
 
        direction === 'right' ? onSwipeRight(item) : onSwipeLeft(item);
 
        Animated.timing(this.state.position2, {
            toValue: { x: 0, y: -10 },
            duration: 300
        }).start(() => {
            // we update state (rerender page) ONLY after the animation is finished
            this.state.position.setValue({ x: 0, y: 0 });
            this.state.position2.setValue({ x: 0, y: 0 });
            this.setState({ index: this.state.index + 1 });
        });
    }
 
    resetPosition() {
        Animated.spring(this.state.position, {
            toValue: { x: 0, y: 0 }
        }).start();
    }
 
    getCardStyle() {
        const { position } = this.state;
        const rotate = position.x.interpolate({
            inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
            outputRange: ['-120deg', '0deg', '120deg']
        });
 
        return {
            ...position.getLayout(),
            transform: [{ rotate }]
        };
    }
 
    renderCards() {
        if (this.state.index >= this.props.data.length) {
            return this.props.renderNoMoreCards();
        }
        return this.props.data.map((item, i) => {
            if (i < this.state.index) { return null; }
 
            if (i === this.state.index) {
                return (
                    <Animated.View
                        key={item.id}
                        style={[this.getCardStyle(), styles.cardStyle, {zIndex: 99}]}
                        {...this.state.panResponder.panHandlers}
                    >
                        {this.props.renderCard(item)}
                    </Animated.View>
                );
            }
            return (
                <Animated.View 
                    key={item.id} 
                    style={[styles.cardStyle, { top: 10 * (i - this.state.index), zIndex: 5}]}
                >
                    {this.props.renderCard(item)}
                </Animated.View>
            );
        }).reverse();
    }
 
 
    render() {
        console.log('middle');
        return (
            <Animated.View style={this.state.position2.getLayout()}>
                {this.renderCards()}
            </Animated.View>
        );
    }
}
 
const styles = {
    cardStyle: {
        position: 'absolute',
        width: SCREEN_WIDTH
    }
}
 
export default Deck;