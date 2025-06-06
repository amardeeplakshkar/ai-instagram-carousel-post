import React from 'react'



const PostImage = () => {
    return (
        <div
            style={{
                backgroundImage: 'url(https://wallpapers.com/images/high/dark-abstract-background-pr8eaidlm3b59m10.webp)',

            }}
            className={`h-[1080px] my-4 flex flex-col gap-4 bg-cover bg-center bg-no-repeat bg-red-400 aspect-[3/4] overflow-hidden p-4 text-[calc(100vw/30)]`}>
            <h2 className='text-white font-bold'>
                @AMARDEEP.WEBDEV
            </h2>
            <h3 className='text-white font-bold'>
                while
            </h3>
            <section className='p-2 bg-black m-2 rounded-xl'>
                <div className='flex gap-2 border-b p-3 border-gray-500'>
                    <span className='bg-red-500 h-[1.5rem] w-[1.5rem] rounded-full' />
                    <span className='bg-yellow-500 h-[1.5rem] w-[1.5rem] rounded-full' />
                    <span className='bg-green-500 h-[1.5rem] w-[1.5rem] rounded-full' />
                </div>
                <div className='p-2'>
                    <div className='text-white text-wrap overflow-x-auto' style={{
                        padding: '20px',
                        lineHeight: '2.5rem',
                        fontSize: '1.5rem',
                        overflowX: 'auto',
                        fontFamily: 'monospace'
                    }}>
                        <div style={{ color: '#0074D9' }}>const animals = [<span style={{ color: '#2ECC40' }}>'dog'</span>, <span style={{ color: '#2ECC40' }}>'cat'</span>, <span style={{ color: '#2ECC40' }}>'cow'</span>, <span style={{ color: '#2ECC40' }}>'horse'</span>, <span style={{ color: '#2ECC40' }}>'mouse'</span>]</div>
                        <div style={{ color: '#0074D9' }}>let i = 0</div>
                        <br />
                        <div style={{ color: '#0074D9' }}>while ( i &lt; animals.length) {'{'}</div>
                        <div style={{ paddingLeft: '20px', color: '#0074D9' }}>console.log(animals[i].toUpperCase());</div>
                        <div style={{ paddingLeft: '20px', color: '#0074D9' }}>i++;</div>
                        <div style={{ color: '#0074D9' }}>{'}'}</div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default PostImage