import { useLogViewerViewModel } from './hooks/useLogViewerViewModel';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './components/ui/select';

function App() {
  const {
    appNames,
    selectedApp,
    models,
    selectedModel,
    logData,
    loading,
    error,
    handleAppChange,
    handleModelChange,
    startDate,
    endDate,
    handleStartDateChange,
    handleEndDateChange,
    fetchLogData,
  } = useLogViewerViewModel();

  const customStyles = `
    @keyframes glow {
      from {
        text-shadow: 0 0 20px rgba(255, 107, 157, 0.5);
      }
      to {
        text-shadow: 0 0 40px rgba(255, 107, 157, 0.8);
      }
    }
    .animate-glow {
      animation: glow 2s ease-in-out infinite alternate;
    }
    input[type='date']::-webkit-datetime-edit-text,
    input[type='date']::-webkit-datetime-edit-month-field,
    input[type='date']::-webkit-datetime-edit-day-field,
    input[type='date']::-webkit-datetime-edit-year-field {
      text-align: center;
    }
    input[type='date'] {
      position: relative;
    }
    input[type='date']::-webkit-calendar-picker-indicator {
      position: absolute;
      right: 1rem;
      opacity: 1;
      cursor: pointer;
    }
  `;

  return (
    <>
      <style>{customStyles}</style>
      <div className='min-h-screen text-white'>
        <header className='relative z-10 p-6 bg-black bg-opacity-30 backdrop-blur-md border-b-2 border-pink-400 border-opacity-50'>
          <div className='text-center'>
            <h1 className='text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-yellow-300 to-pink-400 animate-glow leading-tight pb-3'>
              G-AI LAB Log Viewer
            </h1>
            <p className='text-lg text-white text-opacity-90'>
              앱 사용 현황을 간편하게 확인하세요.
            </p>
          </div>
        </header>

        <main className='relative z-5 p-8'>
          <section className='mb-16'>
            <div className='bg-black bg-opacity-20 backdrop-blur-md rounded-2xl p-8 border-2 border-pink-400 border-opacity-30 shadow-2xl'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-8'>
                <div className='flex flex-col items-center'>
                  <label
                    htmlFor='app-select'
                    className='block text-yellow-300 text-2xl font-bold mb-4'
                  >
                    앱이름
                  </label>
                  <Select value={selectedApp} onValueChange={handleAppChange}>
                    <SelectTrigger
                      id='app-select'
                      className='w-64 bg-black bg-opacity-40 border-pink-400 text-white rounded-full flex justify-center'
                    >
                      <SelectValue placeholder='앱 선택' />
                    </SelectTrigger>
                    <SelectContent className='bg-black text-white border-pink-400'>
                      {appNames.map((appName) => (
                        <SelectItem key={appName} value={appName}>
                          {appName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className='flex flex-col items-center'>
                  <label
                    htmlFor='model-select'
                    className='block text-yellow-300 text-2xl font-bold mb-4'
                  >
                    모델
                  </label>
                  <Select
                    value={selectedModel}
                    onValueChange={handleModelChange}
                  >
                    <SelectTrigger
                      id='model-select'
                      className='w-64 bg-black border-pink-400 text-white rounded-full flex justify-center'
                    >
                      <SelectValue placeholder='모델 선택' />
                    </SelectTrigger>
                    <SelectContent className='bg-black text-white border-pink-400'>
                      {models.map((model) => (
                        <SelectItem key={model} value={model}>
                          {model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                <div className='flex flex-col items-center'>
                  <label
                    htmlFor='start-date'
                    className='block text-yellow-300 text-lg font-semibold mb-2'
                  >
                    시작 날짜
                  </label>
                  <input
                    id='start-date'
                    type='date'
                    className='w-64 bg-black bg-opacity-40 border border-pink-400 text-white rounded-full px-4 py-2 text-center'
                    value={startDate ?? ''}
                    onChange={(e) => handleStartDateChange(e.target.value)}
                    max={endDate ?? undefined}
                  />
                </div>
                <div className='flex flex-col items-center'>
                  <label
                    htmlFor='end-date'
                    className='block text-yellow-300 text-lg font-semibold mb-2'
                  >
                    종료 날짜
                  </label>
                  <input
                    id='end-date'
                    type='date'
                    className='w-64 bg-black bg-opacity-40 border border-pink-400 text-white rounded-full px-4 py-2 text-center'
                    value={endDate ?? ''}
                    onChange={(e) => handleEndDateChange(e.target.value)}
                    min={startDate ?? undefined}
                  />
                </div>
              </div>
            </div>
          </section>

          <div className='flex justify-center mb-12'>
            <button
              className='bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white font-black text-2xl py-4 px-12 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50'
              onClick={fetchLogData}
              disabled={
                selectedApp === '선택' ||
                selectedModel === '선택' ||
                !startDate ||
                !endDate ||
                loading
              }
            >
              ✨ 조회하기 ✨
            </button>
          </div>

          {loading && (
            <div className='flex justify-center items-center h-64'>
              <div className='animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-pink-400'></div>
            </div>
          )}
          {error && (
            <div className='bg-red-900 bg-opacity-50 border-2 border-red-700 text-red-200 px-6 py-4 rounded-2xl text-center'>
              <strong className='font-bold text-xl'>오류:</strong>
              <span className='block sm:inline ml-2 text-lg'>{error}</span>
            </div>
          )}
          {!loading && !error && logData && (
            <section className='grid grid-cols-1 gap-8 text-center'>
              <div className='bg-black bg-opacity-20 backdrop-blur-md rounded-2xl p-8 border-2 border-pink-400 border-opacity-30 shadow-lg transform hover:scale-105 transition-transform duration-300'>
                <h2 className='text-2xl font-bold text-yellow-300 mb-4'>
                  사용 횟수
                </h2>
                <p className='text-4xl font-black text-pink-400'>
                  {logData.count.toLocaleString()}회
                </p>
              </div>
              <div className='bg-black bg-opacity-20 backdrop-blur-md rounded-2xl p-8 border-2 border-pink-400 border-opacity-30 shadow-lg transform hover:scale-105 transition-transform duration-300'>
                <h2 className='text-2xl font-bold text-yellow-300 mb-4'>
                  총 입력 글자 수
                </h2>
                <p className='text-4xl font-black text-green-400'>
                  {logData.inputLength.toLocaleString()}자
                </p>
              </div>
              <div className='bg-black bg-opacity-20 backdrop-blur-md rounded-2xl p-8 border-2 border-pink-400 border-opacity-30 shadow-lg transform hover:scale-105 transition-transform duration-300'>
                <h2 className='text-2xl font-bold text-yellow-300 mb-4'>
                  총 출력 글자 수
                </h2>
                <p className='text-4xl font-black text-purple-400'>
                  {logData.outputLength.toLocaleString()}자
                </p>
              </div>
            </section>
          )}
        </main>
      </div>
    </>
  );
}

export default App;
