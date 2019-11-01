import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';
import Touchable from 'react-native-platform-touchable';
import isEqual from 'deep-equal';

import Markdown from '../markdown';
import openLink from '../../utils/openLink';
import sharedStyles from '../../views/Styles';
import { COLOR_BACKGROUND_CONTAINER, COLOR_BORDER, themes } from '../../constants/colors';

const styles = StyleSheet.create({
	button: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 6,
		alignSelf: 'flex-end',
		backgroundColor: COLOR_BACKGROUND_CONTAINER,
		borderColor: COLOR_BORDER,
		borderWidth: 1,
		borderRadius: 4
	},
	attachmentContainer: {
		flex: 1,
		borderRadius: 4,
		flexDirection: 'column',
		padding: 15
	},
	authorContainer: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center'
	},
	author: {
		flex: 1,
		fontSize: 16,
		...sharedStyles.textColorNormal,
		...sharedStyles.textMedium
	},
	time: {
		fontSize: 12,
		marginLeft: 10,
		...sharedStyles.textRegular,
		fontWeight: '300'
	},
	fieldsContainer: {
		flex: 1,
		flexWrap: 'wrap',
		flexDirection: 'row'
	},
	fieldContainer: {
		flexDirection: 'column',
		padding: 10
	},
	fieldTitle: {
		fontSize: 14,
		...sharedStyles.textColorNormal,
		...sharedStyles.textSemibold
	},
	fieldValue: {
		fontSize: 14,
		...sharedStyles.textColorNormal,
		...sharedStyles.textRegular
	},
	marginTop: {
		marginTop: 4
	}
});

const Title = React.memo(({ attachment, timeFormat, theme }) => {
	if (!attachment.author_name) {
		return null;
	}
	const time = attachment.ts ? moment(attachment.ts).format(timeFormat) : null;
	return (
		<View style={styles.authorContainer}>
			{attachment.author_name ? <Text style={[styles.author, { color: themes[theme].titleText }]}>{attachment.author_name}</Text> : null}
			{time ? <Text style={[styles.time, { color: themes[theme].auxiliaryText }]}>{ time }</Text> : null}
		</View>
	);
}, () => true);

const Description = React.memo(({
	attachment, baseUrl, user, getCustomEmoji, useMarkdown, theme
}) => {
	const text = attachment.text || attachment.title;
	if (!text) {
		return null;
	}
	return (
		<Markdown
			msg={text}
			baseUrl={baseUrl}
			username={user.username}
			getCustomEmoji={getCustomEmoji}
			useMarkdown={useMarkdown}
			theme={theme}
		/>
	);
}, (prevProps, nextProps) => {
	if (prevProps.attachment.text !== nextProps.attachment.text) {
		return false;
	}
	if (prevProps.attachment.title !== nextProps.attachment.title) {
		return false;
	}
	return true;
});

const Fields = React.memo(({ attachment, theme }) => {
	if (!attachment.fields) {
		return null;
	}
	return (
		<View style={styles.fieldsContainer}>
			{attachment.fields.map(field => (
				<View key={field.title} style={[styles.fieldContainer, { width: field.short ? '50%' : '100%' }]}>
					<Text style={[styles.fieldTitle, { color: themes[theme].titleText }]}>{field.title}</Text>
					<Text style={[styles.fieldValue, { color: themes[theme].titleText }]}>{field.value}</Text>
				</View>
			))}
		</View>
	);
}, (prevProps, nextProps) => isEqual(prevProps.attachment.fields, nextProps.attachment.fields));

const Reply = React.memo(({
	attachment, timeFormat, baseUrl, user, index, getCustomEmoji, useMarkdown, theme
}) => {
	if (!attachment) {
		return null;
	}

	const onPress = () => {
		let url = attachment.title_link || attachment.author_link;
		if (!url) {
			return;
		}
		if (attachment.type === 'file') {
			url = `${ baseUrl }${ url }?rc_uid=${ user.id }&rc_token=${ user.token }`;
		}
		openLink(url);
	};

	return (
		<Touchable
			onPress={onPress}
			style={[
				styles.button,
				index > 0 && styles.marginTop,
				{
					backgroundColor: themes[theme].auxiliaryBackground,
					borderColor: themes[theme].borderColor
				}
			]}
			background={Touchable.Ripple('#fff')}
		>
			<View style={styles.attachmentContainer}>
				<Title attachment={attachment} timeFormat={timeFormat} theme={theme} />
				<Description
					attachment={attachment}
					timeFormat={timeFormat}
					baseUrl={baseUrl}
					user={user}
					getCustomEmoji={getCustomEmoji}
					useMarkdown={useMarkdown}
					theme={theme}
				/>
				<Fields attachment={attachment} theme={theme} />
			</View>
		</Touchable>
	);
}, (prevProps, nextProps) => isEqual(prevProps.attachment, nextProps.attachment));

Reply.propTypes = {
	attachment: PropTypes.object,
	timeFormat: PropTypes.string,
	baseUrl: PropTypes.string,
	user: PropTypes.object,
	index: PropTypes.number,
	useMarkdown: PropTypes.bool,
	theme: PropTypes.string,
	getCustomEmoji: PropTypes.func
};
Reply.displayName = 'MessageReply';

Title.propTypes = {
	attachment: PropTypes.object,
	timeFormat: PropTypes.string,
	theme: PropTypes.string
};
Title.displayName = 'MessageReplyTitle';

Description.propTypes = {
	attachment: PropTypes.object,
	baseUrl: PropTypes.string,
	user: PropTypes.object,
	useMarkdown: PropTypes.bool,
	getCustomEmoji: PropTypes.func,
	theme: PropTypes.string
};
Description.displayName = 'MessageReplyDescription';

Fields.propTypes = {
	attachment: PropTypes.object,
	theme: PropTypes.string
};
Fields.displayName = 'MessageReplyFields';

export default Reply;
