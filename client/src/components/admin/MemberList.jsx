import { Checkbox, List, Pagination } from 'antd';
import { useState } from 'react';

const MemberList = ({ members, type, handlePermissionChange }) => {
  const users = (members || []).map(u => ({ id: u._id, username: u.username }));
  const userIds = (members || []).map(u => u._id);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const indexOfLastItem = currentPage * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;
  const currentMembers = users.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
  };

  return (
    <>
      <List
        className='h-[16vh]'
        grid={{ gutter: 16, column: 2 }}
        dataSource={currentMembers}
        pagination={false}
        renderItem={member => (
          <List.Item>
            <Checkbox checked={userIds.includes(member.id)} onChange={() => handlePermissionChange(member.id, type)}>
              {member.username}
            </Checkbox>
          </List.Item>
        )}
      />
      <div className='text-right my-4'>
        <Pagination
          size='small'
          current={currentPage}
          total={members.length}
          pageSize={pageSize}
          onChange={handlePageChange}
          showSizeChanger={false}
          showQuickJumper={false}
        />
      </div>
    </>
  );
};
export default MemberList;
