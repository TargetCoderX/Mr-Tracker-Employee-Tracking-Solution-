import Authenticated from '@/Layouts/AuthenticatedLayout';
import React from 'react';

function Profile({auth}) {
  return (
    <Authenticated user={auth}>
hi
    </Authenticated>
  );
}

export default Profile;
