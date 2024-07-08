import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import BasicLayout from '../../layout/BasicLayout';
import axios from 'axios';
import { useUserStore } from '../../store/UserStore';


const MyQuestionListPage = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const questionsPerPage = 10;
  const navigate = useNavigate();
  const [questionList, setQuestionList] = useState([]);
  const { id, replaceId } = useUserStore();

  useEffect(() => {
    const fetchData = async () => {
      if (id === null) return;
      try {
        const response = await axios.get(`/api/questions/user/${id}`, {
          withCredentials: true,
        });
        const data = response.data;
        const questions = Object.keys(data).reverse().map((key) => ({ id: key, ...data[key] }));
        questions.sort((a, b) => b.registerTime - a.registerTime);

        const modifiedQuestions = questions.map(question => ({
          ...question,
          content: question.content.length > 5 ? question.content.slice(0, 10) + '...' : question.content
        }));

        setQuestionList(modifiedQuestions);
      } catch (error) {
        console.error('문의 리스트를 불러오던 중 문제가 생겼습니다: ' + error.message);
      }
    };

    fetchData();
  }, [id]);

  const indexOfLastQuestion = (currentPage + 1) * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = questionList.slice(indexOfFirstQuestion, indexOfLastQuestion);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleInquiryClick = (questionId) => {
    navigate(`/customer/question/detail?id=${questionId}`);
  };

  return (
    <BasicLayout>
      <div className="container mx-auto py-20 px-4">
        <h1 className="text-2xl font-bold mb-6 border-b text-sub">{replaceId(id)} 님의 문의 리스트</h1>
        {questionList.length > 0 ? (
          <>
            <table className="w-full">
              <thead>
                <tr className="bg-baritem text-center text-lg">
                  <th className="px-4 py-2 border-b border-bor">제목</th>
                  <th className="px-4 py-2 border-b border-bor">문의상품</th>
                  <th className="px-4 py-2 border-b border-bor">문의유형</th>
                  <th className="px-4 py-2 border-b border-bor">내용</th>
                  <th className="px-4 py-2 border-b border-bor">문의 날짜</th>
                  <th className="px-4 py-2 border-b border-bor">답변 여부</th>
                </tr>
              </thead>
              <tbody>
                {currentQuestions.map((question) => (
                  <tr
                    key={question.id}
                    className="border-b border-bor cursor-pointer hover:bg-hov transition-colors duration-300"
                    onClick={() => handleInquiryClick(question.id)}
                  >
                    <td className="py-2 px-4 text-sub text-center text-lg">{question.title}</td>
                    <td className="py-3 px-4 text-sub text-center text-lg">{question.productName}</td>
                    <td className="py-3 px-4 text-sub text-center text-lg">{question.questionType}</td>
                    <td className="py-3 px-4 text-sub text-center text-lg">{question.content}</td>
                    <td className="py-3 px-4 text-sub text-center text-lg">{question.questionDate}</td>
                    <td className="py-3 px-4 text-sub text-center text-lg">{question.isResponse ? "답변완료" : "답변대기"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-center mt-6 text-white">
              <ReactPaginate
                previousLabel={'<'}
                nextLabel={'>'}
                breakLabel={'...'}
                pageCount={Math.ceil(questionList.length / questionsPerPage)}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={'flex items-center'}
                activeClassName={'bg-button2 text-white'}
                pageClassName={'mx-2'}
                pageLinkClassName={'px-3 py-2 rounded-md hover:bg-hov transition-colors duration-300'}
                previousClassName={'mx-2'}
                previousLinkClassName={'px-3 py-2 rounded-md hover:bg-hov transition-colors duration-300'}
                nextClassName={'mx-2'}
                nextLinkClassName={'px-3 py-2 rounded-md hover:bg-hov transition-colors duration-300'}
              />
            </div>
          </>
        ) : (
          <p className="text-center text-lg text-sub mt-8">문의 내역이 없습니다.</p>
        )}
      </div>
    </BasicLayout>
  );
};

export default MyQuestionListPage;
