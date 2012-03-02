require 'base64'
require 'openssl'

module ImageHelper
  def cdn_image_tag id, opts = {}
    if opts.empty?
      image_tag "http://localhost:3000/image/#{id}"
    else
      process = { command: '-resize', params: opts[:size], key: 'secret', timestamp: Time.new.to_i * 1000 }
      query_string = process.inject('') { |memo, (k,v)| memo << "#{k}=#{v}&"}.chomp("&")

      digest = OpenSSL::Digest::Digest.new('sha1')
      process[:token] = OpenSSL::HMAC.hexdigest(digest, 'secret', query_string)
      image_tag "http://localhost:3000/image/#{id}/process/#{Base64.encode64(JSON.generate(process))}"
    end
  end

  def generate_data_url
    opts = {
      timestamp: Time.new.to_i * 1000,
      key: 'secret'
    }

    digest = OpenSSL::Digest::Digest.new('sha1')
    opts[:token] = OpenSSL::HMAC.hexdigest(digest, 'secret', "/image?#{opts.to_query}")
    path = "/image?#{opts.to_query}"
  end
end