import React from 'react';
import get from 'lodash/get';
import qs from 'query-string';
import { shareItems } from '@events/share';
import { closeModal } from '@events/modal';
import { useLocation } from 'react-router-dom';
import SharingModal from '@shared/components/SharingModal';

import useStyles from './styles';

const collaboratorsMock = [
  {
    id: 'morochroyce@gmail.com',
    mainText: 'Peter Adams',
    secondaryText: 'morochroyce@gmail.com',
    imageSrc: 'https://cdn.theatlantic.com/thumbor/55coU3IJRzsQ16uvkFvYoLl3Pkc=/200x200/filters:format(png)/media/None/image/original.png',
    permissionsId: 'edit',
    isOwner: true,
  },
  {
    id: 'morochgfx@gmail.com',
    mainText: 'morochgfx@gmail.com',
    secondaryText: 'Outside of Team',
    permissionsId: 'view',
  },
  {
    id: 'maria.mart@gmail.com',
    mainText: 'Maria Martinez',
    secondaryText: 'maria.mart@gmail.com',
    imageSrc: 'https://aboutfaceskincare.com/wp-content/uploads/2019/11/About-Face-Skincare1172_pp-1-e1574785727292.jpg',
    permissionsId: 'edit',
  },
  {
    id: 'morochroyce@gmail.com2',
    mainText: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus recusandae est nobis quia exercitationem error harum ex laborum molestiae beatae molestias itaque voluptas soluta, eos dignissimos! In inventore autem asperiores!',
    secondaryText: 'morochroyceconsecteturadipisicing@gmail.com',
    permissionsId: 'edit',
  },
  {
    id: 'asd123@gmail.com',
    mainText: 'asd123@gmail.com',
    secondaryText: 'Outside of Team',
    permissionsId: 'view',
  },
  {
    id: 'mon.kallen@gmail.com4',
    mainText: 'Mon Kallen',
    secondaryText: 'mon.kallen@gmail.com4',
    permissionsId: 'edit',
  },
];

const Sharing = () => {
  const location = useLocation();
  const classes = useStyles();

  /* eslint-disable no-console */
  const onShareLinkClick = (...args) => {
    console.log('onShareLinkClick', ...args);
  };

  const onChangeUserPermissions = (...args) => {
    console.log('onChangeUserPermissions', ...args);
  };

  const onChangeInputPermissions = (...args) => {
    console.log('onChangeInputPermissions', ...args);
  };

  const onSendEmailClick = (members, message) => {
    const query = qs.parse(location.search);

    const bucket = get(query, 'bucket', 'personal');
    const itemPaths = get(query, 'itemPaths', []);

    const payload = {
      bucket,
      customMessage: message,
      invitations: members.map((member) => ({
        invitationType: 'INVITE_THROUGH_EMAIL',
        invitationValue: member.id,
      })),
      itemPaths: typeof itemPaths === 'string'
        ? [itemPaths]
        : itemPaths,
    };

    shareItems(payload);
    closeModal();
  };

  return (
    <SharingModal
      ext="folder"
      filename="folder"
      shareLink={false}
      className={classes.root}
      collaborators={collaboratorsMock}
      onShareLinkClick={onShareLinkClick}
      onChangeUserPermissions={onChangeUserPermissions}
      onChangeInputPermissions={onChangeInputPermissions}
      onSendEmailClick={onSendEmailClick}
    />
  );
};

export default Sharing;
