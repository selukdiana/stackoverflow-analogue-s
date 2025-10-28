import { useEffect } from 'react';
import { useSearchParams } from 'react-router';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { getUsers } from '../../store/slices/usersSlice';
import { UserItem } from '../../components/UserItem';
import { Pagination } from '../../components/Pagination';

export const UsersPage = () => {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get('page') || 1;
  const {
    totalPages,
    data: users,
    isLoading,
    error,
  } = useAppSelector((state) => state.users);

  const handleNextPageClick = () => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set('page', `${+page + 1}`);
      return params;
    });
  };

  const handlePrevPageClick = () => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set('page', `${+page - 1}`);
      return params;
    });
  };

  useEffect(() => {
    dispatch(getUsers(+page));
  }, [dispatch, page]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  return (
    <>
      <ul>
        {users.map((user) => (
          <UserItem key={user.id} {...user} />
        ))}
      </ul>
      <Pagination
        totalPages={totalPages}
        currentPage={+page}
        handleNextClick={handleNextPageClick}
        handlePrevClick={handlePrevPageClick}
      />
    </>
  );
};
