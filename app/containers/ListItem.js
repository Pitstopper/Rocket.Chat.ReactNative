import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { RectButton } from 'react-native-gesture-handler';

import { COLOR_TEXT, themes } from '../constants/colors';
import sharedStyles from '../views/Styles';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		height: 56,
		paddingHorizontal: 15
	},
	disabled: {
		opacity: 0.3
	},
	textContainer: {
		flex: 1,
		justifyContent: 'center'
	},
	title: {
		fontSize: 16,
		...sharedStyles.textColorNormal,
		...sharedStyles.textRegular
	},
	subtitle: {
		fontSize: 14,
		...sharedStyles.textColorNormal,
		...sharedStyles.textRegular
	}
});

const Content = React.memo(({
	title, subtitle, disabled, testID, right, theme
}) => (
	<View style={[styles.container, disabled && styles.disabled, { backgroundColor: themes[theme].backgroundColor }]} testID={testID}>
		<View style={styles.textContainer}>
			<Text style={[styles.title, { color: themes[theme].titleText }]}>{title}</Text>
			{subtitle
				? <Text style={[styles.subtitle, { color: themes[theme].bodyText }]}>{subtitle}</Text>
				: null
			}
		</View>
		{right ? right() : null}
	</View>
));

const Button = React.memo(({
	onPress, ...props
}) => (
	<RectButton
		onPress={onPress}
		activeOpacity={0.1}
		underlayColor={COLOR_TEXT}
		enabled={!props.disabled}
	>
		<Content {...props} />
	</RectButton>
));

const Item = React.memo(({ ...props }) => {
	if (props.onPress) {
		return <Button {...props} />;
	}
	return <Content {...props} />;
});

Item.propTypes = {
	onPress: PropTypes.func
};

Content.propTypes = {
	title: PropTypes.string.isRequired,
	subtitle: PropTypes.string,
	right: PropTypes.func,
	disabled: PropTypes.bool,
	testID: PropTypes.string,
	theme: PropTypes.string
};

Button.propTypes = {
	onPress: PropTypes.func,
	disabled: PropTypes.bool
};

Button.defaultProps = {
	disabled: false
};

export default Item;
