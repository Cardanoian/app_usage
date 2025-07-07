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
  } = useLogViewerViewModel();

  return (
    <div className='min-h-screen bg-gray-900 text-white flex flex-col items-center p-4'>
      <div className='w-full max-w-4xl'>
        <header className='text-center mb-8'>
          <h1 className='text-4xl font-bold tracking-tight'>
            G-AI LAB 로그 뷰어
          </h1>
          <p className='text-gray-400 mt-2'>
            앱 사용 현황을 간편하게 확인하세요.
          </p>
        </header>

        <div className='bg-gray-800 shadow-lg rounded-lg p-6 mb-8'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='flex justify-center'>
              <div className='text-center'>
                <label
                  htmlFor='app-select'
                  className='block text-gray-300 mb-2 text-2xl font-bold'
                >
                  앱이름
                </label>
                <Select value={selectedApp} onValueChange={handleAppChange}>
                  <SelectTrigger
                    id='app-select'
                    className='bg-gray-700 border-gray-600 text-white'
                  >
                    <SelectValue placeholder='앱 선택' />
                  </SelectTrigger>
                  <SelectContent className='bg-gray-700 text-white border-gray-600'>
                    {appNames.map((appName) => (
                      <SelectItem
                        key={appName}
                        value={appName}
                        className='focus:bg-gray-600'
                      >
                        {appName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className='flex justify-center'>
              <div className='text-center'>
                <label
                  htmlFor='model-select'
                  className='block text-gray-300 mb-2 text-2xl font-bold'
                >
                  모델
                </label>
                <Select value={selectedModel} onValueChange={handleModelChange}>
                  <SelectTrigger
                    id='model-select'
                    className='bg-gray-700 border-gray-600 text-white'
                  >
                    <SelectValue placeholder='모델 선택' />
                  </SelectTrigger>
                  <SelectContent className='bg-gray-700 text-white border-gray-600'>
                    {models.map((model) => (
                      <SelectItem
                        key={model}
                        value={model}
                        className='focus:bg-gray-600'
                      >
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {loading && (
          <div className='flex justify-center items-center h-64'>
            <div className='animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500'></div>
          </div>
        )}
        {error && (
          <div className='bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-center'>
            <strong className='font-bold'>오류:</strong>
            <span className='block sm:inline ml-2'>{error}</span>
          </div>
        )}
        {!loading && !error && (
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 text-center'>
            <div className='bg-gray-800 shadow-lg rounded-lg p-6 transform hover:scale-105 transition-transform duration-300'>
              <h2 className='text-lg font-semibold text-gray-400'>사용 횟수</h2>
              <p className='text-4xl font-bold text-blue-400 mt-2'>
                {logData ? `${logData.count.toLocaleString()}회` : '-'}
              </p>
            </div>
            <div className='bg-gray-800 shadow-lg rounded-lg p-6 transform hover:scale-105 transition-transform duration-300'>
              <h2 className='text-lg font-semibold text-gray-400'>
                총 입력 글자 수
              </h2>
              <p className='text-4xl font-bold text-green-400 mt-2'>
                {logData ? `${logData.inputLength.toLocaleString()}자` : '-'}
              </p>
            </div>
            <div className='bg-gray-800 shadow-lg rounded-lg p-6 transform hover:scale-105 transition-transform duration-300'>
              <h2 className='text-lg font-semibold text-gray-400'>
                총 출력 글자 수
              </h2>
              <p className='text-4xl font-bold text-purple-400 mt-2'>
                {logData ? `${logData.outputLength.toLocaleString()}자` : '-'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
